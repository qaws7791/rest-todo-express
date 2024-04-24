import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

const AVAILABLE_MIME_TYPES = ["application/json"];

export const acceptMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accept = req.accepts(AVAILABLE_MIME_TYPES);
  if (!accept) {
    const details = `Supported MIME types: ${AVAILABLE_MIME_TYPES.join(", ")}`;
    next(
      new AppError({
        name: "Not Acceptable",
        statusCode: 406,
        message: details,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
  next();
};
