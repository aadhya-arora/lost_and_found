import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
  // final fallback: default behavior (looks in process.cwd())
  const result = dotenv.config();
  if (result.parsed && Object.keys(result.parsed).length > 0) {
    dotenvLoadedFrom = ".env (default)";
    console.log(`[dotenv] loaded env from default .env`);
  } else {
    console.log("[dotenv] no .env file loaded (none found or empty)");
  }
}

import SignUp from "./auth.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import FoundItem from "./foundItem.js";
import LostItem from "./lostItem.js";

const PORT = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET!;

const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Validate required environment variables before attempting DB connection.
const mongoUri = process.env.MONGO_URI;
if (!mongoUri || typeof mongoUri !== "string" || mongoUri.trim() === "") {
  console.error(
    "[env] MONGO_URI is missing or empty. Checked paths:",
    candidateEnvPaths
  );
  console.error(
    "[env] Please set MONGO_URI in your .env (or environment) before starting the server."
  );
  // Fail fast so the app doesn't run in a broken state.
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn(
    "[env] JWT_SECRET is not set. Token signing/verifying may fail."
  );
}

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true } as any)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // Keep process alive so errors are visible; alternatively exit if desired.
  });

app.post("/signUp", (req, res) => {
  console.log("Received signup request. Body:", req.body);

  let { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.error("Missing required fields for signup.");

    return res
      .status(400)
      .json({ error: "All fields (username, email, password) are required." });
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error("Error generating salt:", err);
      return res
        .status(500)
        .json({ error: "Server Error: Salt generation failed." });
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res
          .status(500)
          .json({ error: "Server Error: Password hashing failed." });
      }
      try {
        let createUser = await SignUp.create({
          username,
          email,
          password: hash,
        });
        console.log("User created:", createUser);

        let token = jwt.sign({ email }, jwtSecret);
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
        });
        console.log("Token generated and cookie set.");
        res.status(200).json(createUser);
      } catch (error: any) {
        console.error(
          "Error during user creation or token signing:",
          error.message
        );

        if (error.code === 11000) {
          return res.status(409).json({
            error: "User with this email or username already exists.",
          });
        }
        res.status(500).json({ error: "Server Error: Could not create user." });
      }
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const user = await SignUp.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: user.email, username: user.username },
      jwtSecret
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: "Login Successful" });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ error: "Server Erorr" });
  }
});

// Post lost item without multer (assuming image is already uploaded to cloudinary)
app.post("/lost", async (req, res) => {
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
      imageUrl,
      location,
      category,
      phone,
      email,
    });

    await lostItem.save();
    res.status(201).json(lostItem);
  } catch (error: any) {
    console.error("Error saving lost item:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all lost items
app.get("/lost", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query = { category: category as string };
    }
    const items = await LostItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/found", async (req, res) => {
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
      imageUrl,
      location,
      category,
      phone,
      email,
    });

    await foundItem.save();
    res.status(201).json(foundItem);
  } catch (error: any) {
    console.error("Error saving found item:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all found items
app.get("/found", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query = { category: category as string };
    }
    const items = await FoundItem.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
