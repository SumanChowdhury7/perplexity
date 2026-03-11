import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";

import jwt from "jsonwebtoken";

export async function register(req, res) {
  const { username, email, password } = req.body;
  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email or username already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  await sendEmail({
    to: email,
    subject: "Welcome to perplexity",
    text: `Hi ${username} welcome to perplexity.You registered successfully`,
    html: `<h1>Hi ${username} welcome to perplexity.</h1><p>You registered successfully</p>`,
  })

  res.status(201).json({
    message: "Registered successfully",
    success: true,
    user:{
        id: user._id,
        username: user.username,
        email: user.email
    }
  })

  
}
