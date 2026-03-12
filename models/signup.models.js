import mongoose from "mongoose";
import { type } from "os";

const signupSchema = mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const Signup = mongoose.model("Signup", signupSchema)
export default Signup