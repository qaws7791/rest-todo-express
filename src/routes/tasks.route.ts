import express from "express";
import TasksController from "../controllers/tasks.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateSchema } from "../middleware/validateSchema.middleware";
import {
  CreateTaskSchema,
  DeleteTaskSchema,
  GetTaskPaginationSchema,
  GetTaskSchema,
  PatchTaskSchema,
  PutTaskSchema,
} from "../schemas/task.schema";

const router = express.Router();
const tasksController = new TasksController();

router.get(
  "/",
  authMiddleware,
  validateSchema(GetTaskPaginationSchema),
  tasksController.getAllTasks
);

router.post(
  "/",
  authMiddleware,
  validateSchema(CreateTaskSchema),
  tasksController.createTask
);

router.put("/", tasksController.invalidMethod["/"]);

router.patch("/", tasksController.invalidMethod["/"]);

router.delete("/", tasksController.invalidMethod["/"]);

router.get(
  "/:id",
  authMiddleware,
  validateSchema(GetTaskSchema),
  tasksController.getTask
);

router.post("/:id", tasksController.invalidMethod["/:id"]);

router.put(
  "/:id",
  authMiddleware,
  validateSchema(PutTaskSchema),
  tasksController.putTask
);

router.patch(
  "/:id",
  authMiddleware,
  validateSchema(PatchTaskSchema),
  tasksController.updateTask
);

router.delete(
  "/:id",
  authMiddleware,
  validateSchema(DeleteTaskSchema),
  tasksController.deleteTask
);

export default router;
