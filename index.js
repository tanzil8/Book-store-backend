import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bookRoute from "./routers/book.router.js";
import signupRouter from "./routers/signup.route.js"
import loginRouter from "./routers/login.route.js"

import dns from "dns";
import cors from "cors"

dns.setServers(["1.1.1.1", "8.8.8.8"])

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// const URI = process.env.MONGO_URI;

app.get("/", (req, res) => {
  res.send("Hello world");
});

// MongoDB connection
// mongoose.connect(URI)
// .then(() => {
//   console.log("MongoDB connected");
// })
// .catch((error) => {
//   console.log("MongoDB connection error:", error);
// });


let isConnected = false;
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    isConnected = true;
    console.log("mongoDB connected");
    
  } catch (error) {
    console.error(error)
  }
}

app.use((req, res, next)=>{
  if (!isConnected) {
    connectToMongoDB()
  }
  next()
})

app.use("/book", bookRoute);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

// app.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });

module.exports = app