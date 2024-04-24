import { z, ZodError } from "zod";
import { AppError } from "../utils/appError";
import { NextFunction, Request, Response } from "express";

export const validateSchema =
  (schema: z.ZodObject<any, any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((err) => {
          return {
            field: err.path.join("."),
            message: err.message,
          };
        });

        next(
          new AppError({
            name: "Bad request",
            statusCode: 400,
            message: errorMessages,
          })
        );
      } else {
        next(
          new AppError({
            name: "Internal server error",
            statusCode: 500,
            message: "Error validating request",
          })
        );
      }
    }
  };
