import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../utils/env";
import { AppError } from "../utils/appError";
import asyncHandler from "../utils/asyncHandler";
import { CustomRequest } from "../types";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";

export default class AuthController {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  register = asyncHandler(
    async (
      req: CustomRequest<RegisterInput>,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password } = req.body;

      try {
        const existingUser = await this.userModel.findUser(email);
        if (existingUser) {
          return next(
            new AppError({
              name: "Bad request",
              statusCode: 400,
              message: "User already exists",
            })
          );
        }

        const user = await this.userModel.createUser(email, password);

        res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error creating user",
        });
      }
    }
  );

  login = asyncHandler(
    async (
      req: CustomRequest<LoginInput>,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password } = req.body;

      try {
        const user = await this.userModel.findUser(email);
        if (!user) {
          return next(
            new AppError({
              name: "Unauthorized",
              statusCode: 401,
              message: "Invalid credentials",
            })
          );
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return next(
            new AppError({
              name: "Unauthorized",
              statusCode: 401,
              message: "Invalid credentials",
            })
          );
        }

        const accessToken = jwt.sign(
          { userId: user.id, type: "access" },
          env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        const refreshToken = jwt.sign(
          { userId: user.id, type: "refresh" },
          env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "7d",
          }
        );
        res.json({ accessToken, refreshToken });
      } catch (error) {
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error logging in",
        });
      }
    }
  );
}
