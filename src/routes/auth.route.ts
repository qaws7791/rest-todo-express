import express from "express";
import AuthController from "../controllers/auth.controller";
import { validateSchema } from "../middleware/validateSchema.middleware";
import { LoginSchema, RegisterSchema } from "../schemas/auth.schema";

const router = express.Router();
const authController = new AuthController();

router.post(
  "/register",
  validateSchema(RegisterSchema),
  authController.register
);
router.post("/login", validateSchema(LoginSchema), authController.login);

export default router;
