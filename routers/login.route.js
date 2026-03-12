import express from "express"
import { login } from "../controller/signup.controller.js"

const router = express.Router()

router.post("/", login)

export default router;