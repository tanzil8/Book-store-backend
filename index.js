import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import dns from "dns";

import bookRoute from "./routers/book.router.js";
import signupRouter from "./routers/signup.route.js";
import loginRouter from "./routers/login.route.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Global cache (serverless optimized)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // ❗ timeout add
    })
    .then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err; // ❗ important
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Middleware with error handling (VERY IMPORTANT)
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ✅ Test route (debug ke liye useful)
app.get("/test", (req, res) => {
  res.send("Backend working ✅");
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/book", bookRoute);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

// ✅ Export (NO app.listen)
export default app;