import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import SignUp from "./auth.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
          return res
            .status(409)
            .json({
              error: "User with this email or username already exists.",
            });
        }
        res.status(500).json({ error: "Server Error: Could not create user." });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
