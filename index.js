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

// ✅ Global cache (IMPORTANT for serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongoDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ✅ Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectToMongoDB();
  next();
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