import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

app.post("/lost", upload.single("image"), async (req, res) => {
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
    } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

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

app.get("/lost", async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/found", upload.single("image"), async (req, res) => {
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
    } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

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

app.get("/found", async (req, res) => {
  try {
    const items = await FoundItem.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
