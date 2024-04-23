import express from "express";
import TasksController from "../controllers/tasks.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  CreateTaskSchema,
  DeleteTaskSchema,
  GetTaskPaginationSchema,
  GetTaskSchema,
  UpdateTaskSchema,
} from "../schemas/task.schema";

const router = express.Router();
const tasksController = new TasksController();

router.get(
  "/",
  authMiddleware,
  validate(GetTaskPaginationSchema),
  tasksController.getAllTasks
);
router.get(
  "/:id",
  authMiddleware,
  validate(GetTaskSchema),
  tasksController.getTask
);
router.post(
  "/",
  authMiddleware,
  validate(CreateTaskSchema),
  tasksController.createTask
);
router.patch(
  "/:id",
  authMiddleware,
  validate(UpdateTaskSchema),
  tasksController.updateTask
);
router.delete(
  "/:id",
  authMiddleware,
  validate(DeleteTaskSchema),
  tasksController.deleteTask
);

export default router;
