import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import FoundItem from "./foundItem.js";
import LostItem from "./lostItem.js";
import SignUp from "./auth.js";
import { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax"
    | "strict"
    | boolean
    | undefined,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from possible locations
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
const jwtSecret = process.env.JWT_SECRET!;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("[env] MONGO_URI is missing. Please add it to your .env file.");
  process.exit(1);
}
if (!jwtSecret) {
  console.warn("[env] JWT_SECRET is not set. Token signing/verifying may fail.");
}

const app = express();

// ✅ Middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com" // 🔥 change to your real domain
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as any)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Auth middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ message: "Authentication failed: No token provided." });

  jwt.verify(token, jwtSecret, (err: any, user: any) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token." });
    req.userId = user.id;
    next();
  });
};

// ✅ SIGNUP
app.post("/signUp", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res
      .status(400)
      .json({ error: "All fields (username, email, password) are required." });

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).json({ error: "Salt generation failed." });
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) return res.status(500).json({ error: "Password hashing failed." });
      try {
        const newUser = await SignUp.create({ username, email, password: hash });
        const token = jwt.sign({ id: newUser._id, email }, jwtSecret, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions);
        res.status(200).json({
          message: "Signup successful",
          user: { username: newUser.username, email: newUser.email },
        });
      } catch (error: any) {
        if (error.code === 11000) {
          return res
            .status(409)
            .json({ error: "User with this email or username already exists." });
        }
        res.status(500).json({ error: "Server Error: Could not create user." });
      }
    });
  });
});

// ✅ LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await SignUp.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid password");

  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "7d" });
  res.cookie("token", token, cookieOptions);
  res.json({
    message: "Login successful",
    user: { username: user.username, email: user.email },
  });
});

app.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const user = await SignUp.findById(decoded.id).select("username email contactNo");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});


// ✅ LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
});

// ✅ USER STATUS CHECK
app.get("/user-status", authenticateToken, (req: any, res) => {
  res.status(200).json({ isLoggedIn: true, userId: req.userId });
});

// ✅ LOST ITEMS
app.post("/lost", authenticateToken, async (req: any, res) => {
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
    } = req.body;

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

app.get("/lost", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category: category as string } : {};
    const items = await LostItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-lost-items", authenticateToken, async (req: any, res) => {
  try {
    const items = await LostItem.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ FOUND ITEMS
app.post("/found", authenticateToken, async (req: any, res) => {
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
    } = req.body;

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

app.get("/found", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category: category as string } : {};
    const items = await FoundItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-found-items", authenticateToken, async (req: any, res) => {
  try {
    const items = await FoundItem.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/found/:id", async (req, res) => {
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


app.delete("/lost/:id", async (req, res) => {
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


app.post("/delete-account", authenticateToken, async (req: any, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ message: "Password is required." });

    const user = await SignUp.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password." });

    await SignUp.deleteOne({ _id: userId });

    await LostItem.deleteMany({ userId });
    await FoundItem.deleteMany({ userId });


    res.clearCookie("token", { ...cookieOptions, maxAge: 0 });

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("Delete account error:", err);
    res.status(500).json({ message: "Server error while deleting account." });
  }
});

app.post("/update-contact", authenticateToken, async (req: any, res) => {
  try {
    const { contactNo } = req.body;
    if (!contactNo) {
      return res.status(400).json({ message: "Contact number is required." });
    }

    const user = await SignUp.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

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
