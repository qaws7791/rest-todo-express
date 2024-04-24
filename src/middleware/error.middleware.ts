import { NextFunction, Response, Request } from "express";
import { AppError } from "../utils/appError";

export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.isAppError) {
    res.header(error.headers);

    return res.status(error.statusCode).json({
      error: {
        code: error.statusCode,
        name: error.name,
        details: error.details,
      },
    });
  }

  res.status(500).json({
    error: {
      code: 500,
      name: "Internal server error",
      details: "An unexpected error occurred",
    },
  });
};
