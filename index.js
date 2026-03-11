import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bookRoute from "./routers/book.router.js";

dotenv.config();

const app = express();
const URI = process.env.MONGO_URI;

app.get("/", (req, res) => {
  res.send("Hello world");
});

// MongoDB connection
mongoose.connect(URI)
.then(() => {
  console.log("MongoDB connected");
})
.catch((error) => {
  console.log("MongoDB connection error:", error);
});

app.use("/book", bookRoute);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});