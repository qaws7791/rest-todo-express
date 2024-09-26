import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../utils/env";
import { AppError } from "../utils/appError";
import { accessTokenSchema } from "../schemas/token.schema";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(
      new AppError({
        name: "Unauthorized",
        statusCode: 401,
        message: "Authorization header is required",
      })
    );
  }

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token) {
    return next(
      new AppError({
        name: "Unauthorized",
        statusCode: 401,
        message: "Invalid authorization header",
      })
    );
  }

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    const result = accessTokenSchema.safeParse(decoded);
    if (!result.success) {
      throw new Error("Invalid token");
    }

    req.userId = result.data.userId;
    next();
  } catch (error) {
    return next(
      new AppError({
        name: "Unauthorized",
        statusCode: 401,
        message: "Invalid token",
      })
    );
  }
};
