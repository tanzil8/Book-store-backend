import Signup from "../models/signup.models.js";
import bcrypt from "bcrypt"

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const user = await Signup.findOne({ email });
    if (user) {
      return res.status(401).json({ message: "User already exist" });
    }
    const hashPassword =await bcrypt.hash(password, 10)
    const createUser = new Signup({
      fullName: fullName,
      email: email,
      password: hashPassword,
    });

    await createUser.save();
    res.status(201).json({ message: "User create successfully" });
  } catch (error) {
    console.log("error", error.message);
  }
};


export const login = async(req, res)=>{

    try {
        const {email, password} = req.body;
        const user = await Signup.findOne({email});
        const comparePassword =await bcrypt.compare(password, user.password)
        if (!user || !comparePassword) {
            return res.status(401).json({message:"invalid email and password"})
        }else{
            res.status(201).json({
            message: "Login successfully",
            user:{
                _id: user.id,
                fullName: user.fullName,
                email: user.email,

            }
            })
        }

    } catch (error) {
        console.log(error.message)
        res.status(401).json(error)
    }
}