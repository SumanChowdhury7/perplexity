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

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to perplexity",
    text: `Hi ${username} welcome to perplexity.You registered successfully`,
    html: `
    <h1>Hi ${username} welcome to perplexity.</h1>
    <p>You registered successfully.</p>
    <p>Please verify your email by clicking the link below</p>

    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">
      Verify Email
    </a>

    <p>If you didn't create an account , please ignore</p>
    <p>Best Regards , Team perplexity</p>
  `,
  });

  res.status(201).json({
    message: "Registered Successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function verifyEmail(req, res) {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid token",
        success: false,
      });
    }

    user.verified = true;
    await user.save();

   res.send(`
  <html>
    <head>
      <title>Email Verified</title>
    </head>
    <body style="
      margin:0;
      padding:0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg,#4facfe,#00f2fe);
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      
      <div style="
        background:white;
        padding:40px;
        border-radius:12px;
        text-align:center;
        box-shadow:0 10px 25px rgba(0,0,0,0.2);
        width:350px;
      ">
      
        <h1 style="color:#2ecc71; margin-bottom:10px;">
          ✅ Email Verified
        </h1>

        <p style="color:#555; font-size:16px; margin-bottom:25px;">
          Your email has been verified successfully.  
          You can now log in to your account.
        </p>

        <a 
          href="http://localhost:3000/api/auth/login"
          style="
            display:inline-block;
            padding:12px 25px;
            background:#4facfe;
            color:white;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Go to Login
        </a>

      </div>

    </body>
  </html>
`);
  } catch (error) {
    res.status(400).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token)

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

