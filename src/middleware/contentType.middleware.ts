import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

const VALID_CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
  "application/merge-patch+json",
];

export const contentTypeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const method = req.method;
  const contentType = req.headers["content-type"];
  if (method !== "POST" && method !== "PATCH" && method !== "PUT") {
    return next();
  }

  if (req.body && Object.keys(req.body).length === 0) {
    return next();
  }

  if (!contentType) {
    const details = `Supported Content-Types: ${VALID_CONTENT_TYPES.join(
      ", "
    )}`;
    return next(
      new AppError({
        name: "Unsupported Media Type",
        statusCode: 415,
        message: details,
      })
    );
  }

  if (!VALID_CONTENT_TYPES.includes(contentType)) {
    const details = `Supported Content-Types: ${VALID_CONTENT_TYPES.join(
      ", "
    )}`;
    return next(
      new AppError({
        name: "Unsupported Media Type",
        statusCode: 415,
        message: details,
      })
    );
  }

  next();
};
