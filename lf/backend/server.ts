import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import SignUp from "./auth";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const PORT = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET!;

const app = express();
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
  let { username, email, password } = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return;
    }
    bcrypt.hash(password, salt, async (err, hash) => {
      let createUser = await SignUp.create({
        username,
        email,
        password: hash,
      });
      let token = jwt.sign({ email }, jwtSecret);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
      });
      res.send(createUser);
    });
  });
});

app.listen(PORT, () => {
  console.log("Server is running");
});
