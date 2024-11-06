import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userRegister = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      res.status(400).json({ success: false, message: "email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword });

    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });

  } catch (error: any) {
    console.error("Error during registration:", error.message || error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );

    res
      .status(200)
      .json({ success: true,token, message: "user logged successfully" });

  } catch (error: any) {
    console.error("Error during login:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const userLogout = (req: Request, res: Response) => {
  try {
    // Clear the cookie by setting the expiration date to a past time
    // res.cookie("userToken", "", {
    //   httpOnly: true,
    //   expires: new Date(0),
    // });

    res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error: any) {
    console.error("Error during logout:", error.message || error);
    res.status(500).json({ message: "Internal server error" });
  }
};