import { Router } from "express";
import { login, register, verifyEmail } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
// import { verify } from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);

authRouter.get("/verify-email", verifyEmail)

authRouter.post("/login", loginValidator, login);

export default authRouter;