import { Router } from "express";
import { login, register, verifyEmail, getMe } from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";

import { authUser } from "../middleware/auth.middleware.js";
// import { verify } from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/register", registerValidator, register);

authRouter.get("/verify-email", verifyEmail)

authRouter.post("/login", loginValidator, login);

authRouter.get('/get-me', authUser, getMe)

export default authRouter;