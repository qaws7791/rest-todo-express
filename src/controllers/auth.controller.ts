import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../utils/env";
import { AppError } from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";

const secretKey = env.TOKEN_SECRET;

export default class AuthController {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    try {
      const existingUser = await this.userModel.findUser(email);
      if (existingUser) {
        throw new AppError("User already exists", 409);
      }

      const user = await this.userModel.createUser(email, password);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error creating user", 500);
    }
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    try {
      const user = await this.userModel.findUser(email);
      if (!user) {
        throw new AppError("Invalid credentials", 401);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError("Invalid credentials", 401);
      }
      const token = jwt.sign({ userId: user.id }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Error logging in", 500);
    }
  });
}
