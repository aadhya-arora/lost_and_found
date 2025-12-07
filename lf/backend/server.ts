import express, { Request, Response, NextFunction, CookieOptions,RequestHandler } from "express";
import cors from "cors";
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import FoundItem from "./foundItem.js";
import LostItem from "./lostItem.js";
import SignUp from "./auth.js";
import rateLimit from "express-rate-limit";
import sgMail from "@sendgrid/mail";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidateEnvPaths = [
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env"),
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

const PORT = process.env.PORT || 5000;
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

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CORS_ORIGIN || "https://your-frontend-domain.com"
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

const footerLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: { message: "Too many requests. Please try again later." },
});

app.post("/api/footer-question",  footerLimiter as unknown as RequestHandler, async (req: Request, res: Response) => {
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
      console.warn("Attempt to send email without SENDGRID_API_KEY");
      return res.status(500).json({ message: "Email provider not configured." });
    }

    const safeQuestion = sanitize(question.trim());
    const safeEmail = email?.trim() ? sanitize(email.trim()) : "Not provided";

    const msg = {
      to: adminEmail,
      from: process.env.SENDGRID_FROM || `no-reply@${process.env.DOMAIN || "localhost"}`,
      subject: `New footer question${email ? ` from ${safeEmail}` : ""}`,
      text: `Question:\n${question}\n\nSender: ${email || "Not provided"}`,
      html: `
        <div style="font-family:Arial, sans-serif; color:#111;">
          <h2>New Footer Question</h2>
          <p><strong>Question:</strong></p>
          <p>${safeQuestion.replace(/\n/g, "<br/>")}</p>
          <hr/>
          <p><strong>Sender Email:</strong> ${safeEmail}</p>
          <small>Received at ${new Date().toISOString()}</small>
        </div>
      `,
      replyTo: validateEmail(email) && email ? email : undefined,
    } as any;

    await sgMail.send(msg);

    return res.json({ message: "Question sent successfully." });
  } catch (err) {
    console.error("Footer question error:", err);
    return res.status(500).json({ message: "Failed to send question." });
  }
});


const contactLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 6, 
  message: { message: "Too many contact submissions. Please try again later." },
});

app.post("/api/contact", contactLimiter as unknown as RequestHandler, async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Name is required." });
    }
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return res.status(500).json({ message: "ADMIN_EMAIL is not set in environment." });
    }
    if (!process.env.SENDGRID_API_KEY) {
      console.warn("Attempt to send contact without SENDGRID_API_KEY");
      return res.status(500).json({ message: "Email provider not configured." });
    }

    const safeName = sanitize(String(name).trim()).slice(0, 200);
    const safeMessage = sanitize(String(message).trim()).slice(0, 2000);
    const safeEmail = email?.trim() ? sanitize(email.trim()).slice(0, 200) : "Not provided";

    const msg = {
      to: adminEmail,
      from: process.env.SENDGRID_FROM || `no-reply@${process.env.DOMAIN || "localhost"}`,
      subject: `New contact form message from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${email || "Not provided"}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:Arial, sans-serif; color:#111;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <hr/>
          <p>${safeMessage.replace(/\n/g, "<br/>")}</p>
          <small>Received at ${new Date().toISOString()}</small>
        </div>
      `,
      replyTo: validateEmail(email) && email ? email : undefined,
    } as any;

    await sgMail.send(msg);

    return res.json({ message: "Message sent successfully." });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ message: "Failed to send message." });
  }
});

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

type AuthRequest = Request & { userId?: string };

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax"
    | "strict"
    | boolean
    | undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const cookieToken = (req as any).cookies?.token;
  const headerToken = req.headers?.authorization?.startsWith("Bearer ")
    ? (req.headers.authorization as string).split(" ")[1]
    : null;
  const tokenToUse = cookieToken || headerToken;

  if (!tokenToUse) return res.status(401).json({ message: "Authentication failed: No token provided." });

  if (!jwtSecret) return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET missing." });

  jwt.verify(tokenToUse, jwtSecret, (err: any, decoded: any) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token." });
    req.userId = decoded?.id;
    next();
  });
};

app.post("/signUp", (req: Request, res: Response) => {
  const { username, email, password } = req.body ?? {};

  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields (username, email, password) are required." });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).json({ error: "Salt generation failed." });
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) return res.status(500).json({ error: "Password hashing failed." });
      try {
        const newUser = await SignUp.create({ username, email, password: hash });
        const token = jwt.sign({ id: newUser._id, email }, jwtSecret || "", { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
          message: "Signup successful",
          user: { username: newUser.username, email: newUser.email },
        });
      } catch (error: any) {
        if (error.code === 11000) {
          return res.status(409).json({ error: "User with this email or username already exists." });
        }
        return res.status(500).json({ error: "Server Error: Could not create user." });
      }
    });
  });
});

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body ?? {};
    const user = await SignUp.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const token = jwt.sign({ id: user._id }, jwtSecret || "", { expiresIn: "7d" });
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

app.get("/user-status", authenticateToken, (req: AuthRequest, res: Response) => {
  res.status(200).json({ isLoggedIn: true, userId: req.userId });
});

app.post("/lost", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      color,
      brand,
      uniqueId,
      dateLost,
      timeLost,
      location,
      category,
      phone,
      email,
      imageUrl,
    } = req.body ?? {};

    const lostItem = new LostItem({
      name,
      color,
      brand,
      uniqueId,
      dateLost,
      timeLost,
      location,
      category,
      phone,
      email,
      imageUrl,
      userId: req.userId,
    });

    await lostItem.save();
    res.status(201).json(lostItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/lost", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query = category ? { category: category as string } : {};
    const items = await LostItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-lost-items", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const items = await LostItem.find({ userId: req.userId } as any).sort({ createdAt: -1 });
     res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/found", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      color,
      brand,
      uniqueId,
      dateFound,
      location,
      category,
      phone,
      email,
      imageUrl,
    } = req.body ?? {};

    const foundItem = new FoundItem({
      name,
      color,
      brand,
      uniqueId,
      dateFound,
      location,
      category,
      phone,
      email,
      imageUrl,
      userId: req.userId,
    });

    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/found", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query = category ? { category: category as string } : {};
    const items = await FoundItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-found-items", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const items = await FoundItem.find({ userId: req.userId } as any).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/found/:id", async (req: Request, res: Response) => {
  try {
    const deletedItem = await FoundItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Found item deleted successfully" });
  } catch (error) {
    console.error("Error deleting found item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/lost/:id", async (req: Request, res: Response) => {
  try {
    const deletedItem = await LostItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Lost item deleted successfully" });
  } catch (error) {
    console.error("Error deleting lost item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/delete-account", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { password } = req.body ?? {};

    if (!password) return res.status(400).json({ message: "Password is required." });

    const user = await SignUp.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password." });

    await SignUp.deleteOne({ _id: userId });
    await LostItem.deleteMany({ userId } as any);
    await FoundItem.deleteMany({ userId } as any);

    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error while deleting account." });
  }
});

app.post("/update-contact", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { contactNo } = req.body ?? {};
    if (!contactNo) {
      return res.status(400).json({ message: "Contact number is required." });
    }

    const user = await SignUp.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    user.contactNo = contactNo;
    await user.save();

    res.status(200).json({ message: "Contact updated successfully." });
  } catch (err) {
    console.error("Error updating contact info:", err);
    res.status(500).json({ message: "Server error while updating contact." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
});

