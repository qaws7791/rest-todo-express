import express from "express";
import { AppError } from "../utils/appError";

const router = express.Router();

router.get("*", (req, res, next) => {
  return next(
    new AppError({
      name: "Not found",
      statusCode: 404,
      message: "Route not found",
    })
  );
});

export default router;
