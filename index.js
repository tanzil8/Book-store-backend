import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
const URI = process.env.MONGODB_URI

app.get('/', (req, res) => {
  res.send('Hello world')
  
})
 
try {
    mongoose.connect(URI,{
      useNewUrlParser: true,
      useUndefinedTopology: true
    })

   console.log("MondoDB is connected")
    
} catch (error) {
    console.log(error);
    
}

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})