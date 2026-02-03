import express, { Request, Response, NextFunction, RequestHandler } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import sgMail from "@sendgrid/mail";

import FoundItem from "./foundItem.js";
import LostItem from "./lostItem.js";
import SignUp from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidateEnvPaths = [
  path.resolve(__dirname, "./.env"),
  path.resolve(__dirname, "././.env"),
  path.resolve(process.cwd(), ".env"),
];

let dotenvLoadedFrom: string | null = null;
for (const candidate of candidateEnvPaths) {
  try {
    const result = dotenv.config({ path: candidate });
    if (result.parsed && Object.keys(result.parsed).length > 0) {
      dotenvLoadedFrom = candidate;
      console.log(`[dotenv] loaded env from: ${candidate}`);
      break;
    }
  } catch (e) {}
}
if (!dotenvLoadedFrom) {
  const result = dotenv.config();
  if (result.parsed && Object.keys(result.parsed).length > 0) {
    dotenvLoadedFrom = ".env (default)";
    console.log(`[dotenv] loaded env from default .env`);
  } else {
    console.log("[dotenv] no .env file loaded (none found or empty)");
  }
}

const PORT = Number(process.env.PORT || 5000);
const jwtSecret = process.env.JWT_SECRET ?? "";
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("[env] MONGO_URI is missing. Please add it to your .env file.");
  process.exit(1);
}
if (!jwtSecret) {
  console.warn("[env] JWT_SECRET is not set. Token signing/verifying may fail.");
}

const app = express();

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});


const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);

    // 1. Check for exact match in allowedOrigins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // 2. Check if the origin is any Vercel deployment from your project
    if (origin.endsWith(".vercel.app") && origin.includes("lost-and-found")) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: This origin is not allowed — ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(mongoUri, { })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

if (!process.env.SENDGRID_API_KEY) {
  console.warn("⚠️ SENDGRID_API_KEY not set. Emails will fail until configured.");
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("📧 SendGrid client ready");
}

const sanitize = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const validateEmail = (email?: string) => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

type AuthRequest = Request & { userId?: string };
const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = (req as any).cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    if (!jwtSecret) return res.status(500).json({ error: "Server misconfiguration: JWT_SECRET missing." });

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const footerLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: { message: "Too many requests. Please try again later." },
});

app.post("/api/footer-question", footerLimiter as unknown as RequestHandler, async (req: Request, res: Response) => {
  try {
    const { email, question } = req.body ?? {};

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ message: "Question is required." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return res.status(500).json({ message: "ADMIN_EMAIL is not set in environment." });
    }
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({ message: "Email provider not configured." });
    }

    const safeQuestion = sanitize(question.trim());
    const safeEmail = email?.trim() || "No email provided";

    const msg = {
      to: adminEmail,
      from: process.env.SENDGRID_FROM || adminEmail,
      subject: `Website query from ${safeEmail}`,
      text: `Question from ${safeEmail}:\n\n${safeQuestion}`,
      html: `<p><strong>From:</strong> ${safeEmail}</p><p><strong>Question:</strong></p><p>${safeQuestion}</p>`,
    };

    await sgMail.send(msg);
    res.json({ message: "Message sent" });
  } catch (err: any) {
    console.error("Footer email error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
});

app.post("/signUp", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body ?? {};
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password required" });
    }
    const existing = await SignUp.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new SignUp({ username, email, password: hashed });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    const user = await SignUp.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    if (!jwtSecret) {
      console.error("Server misconfiguration: JWT_SECRET missing.");
      return res.status(500).json({ error: "Server misconfiguration: JWT_SECRET missing." });
    }

    const token = jwt.sign({ id: String(user._id) }, jwtSecret, { expiresIn: "7d" });
    res.cookie("token", token, cookieOptions);
    res.json({ message: "Login successful", user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/me", async (req: Request, res: Response) => {
  try {
    const token = (req as any).cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    if (!jwtSecret) return res.status(500).json({ error: "Server misconfiguration: JWT_SECRET missing." });

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const user = await SignUp.findById(decoded.id).select("username email contactNo");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
});
app.post("/lost", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    let userObjId: mongoose.Types.ObjectId;
    try {
      userObjId = new mongoose.Types.ObjectId(req.userId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const item = new LostItem({ ...(req.body || {}), userId: userObjId as any });
    await item.save();
    res.status(201).json(item);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/lost", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query = { status: "active", ...(category && { category: category as string }) };
    const items = await LostItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/found", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: "Not authenticated" });
    let userObjId: mongoose.Types.ObjectId;
    try {
      userObjId = new mongoose.Types.ObjectId(req.userId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const item = new FoundItem({
      ...req.body,
      userId: userObjId as any
    });
    await item.save();
    res.status(201).json(item);
  } catch (error: any) {
    console.error("Found item save error:", error.message); // Log the specific error
    res.status(400).json({ error: error.message });
  }
});

app.get("/found", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query = { status: "active", ...(category && { category: category as string }) };
    const items = await FoundItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-lost-items", authenticateToken as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    if (!authReq.userId) return res.status(401).json({ error: "Not authenticated" });
    let userObjId: mongoose.Types.ObjectId;
    try {
      userObjId = new mongoose.Types.ObjectId(authReq.userId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const items = await LostItem.find({ userId: userObjId as any }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


app.get("/my-found-items", authenticateToken as any, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  try {
    if (!authReq.userId) return res.status(401).json({ error: "Not authenticated" });
    let userObjId: mongoose.Types.ObjectId;
    try {
      userObjId = new mongoose.Types.ObjectId(authReq.userId);
    } catch (e) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const items = await FoundItem.find({ userId: userObjId as any }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/found/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const claimer = await SignUp.findById(req.userId);
    
    const item = await FoundItem.findByIdAndUpdate(
      req.params.id, 
      { 
        status: "claimed",
        claimedByEmail: claimer?.email
      },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item marked as claimed" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/lost/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const reporter = await SignUp.findById(req.userId);
    
    if (!reporter) {
      return res.status(404).json({ error: "Authenticated user not found" });
    }
    const item = await LostItem.findByIdAndUpdate(
      req.params.id, 
      { 
        status: "claimed",
        foundByEmail: reporter.email
      },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    res.status(200).json({ 
      message: "Item marked as found", 
      foundBy: reporter.email 
    });
  } catch (error: any) {
    console.error("Error updating lost item status:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/update-username", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ message: "Username is required." });
    }

    // Check if the username is already taken
    const existingUser = await SignUp.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use." });
    }

    const user = await SignUp.findByIdAndUpdate(
      req.userId,
      { username: username.trim() },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ message: "Username updated successfully", username: user.username });
  } catch (err) {
    console.error("Update username error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});
