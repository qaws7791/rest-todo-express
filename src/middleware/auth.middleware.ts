import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../utils/env";
import { AppError } from "../utils/appError";

const secretKey = env.TOKEN_SECRET;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(new AppError("Authorization header missing", 401));
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return next(new AppError("Invalid authorization header", 401));
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = (decoded as { userId: number }).userId;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};
