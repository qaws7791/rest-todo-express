import { Request, Response } from "express";
import TasksModel from "../models/tasks.model";
import { TaskDto } from "../dtos/task.dto";
import { HateoasLinks } from "../dtos/common.dto";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import {
  DeleteTaskInput,
  GetTaskInput,
  GetTaskPaginationInput,
  UpdateTaskInput,
} from "../schemas/task.schema";
import { CustomRequest } from "../types";

export default class TasksController {
  private tasksModel: TasksModel;

  constructor() {
    this.tasksModel = new TasksModel();
  }

  addHateoasLinks = (task: TaskDto, req: Request) => {
    const resourceUrl = `${req.protocol}://${req.hostname}/api/v1/tasks/${task.id}`;
    const links: HateoasLinks[] = [
      { rel: "self", href: resourceUrl },
      {
        rel: "update",
        href: resourceUrl,
        action: "PUT",
        types: ["application/json"],
      },
      { rel: "delete", href: resourceUrl, action: "DELETE" },
    ];
    return { ...task, links };
  };

  getAllTasks = asyncHandler(
    async (req: CustomRequest<GetTaskPaginationInput>, res: Response) => {
      try {
        const cursor: number = req.query.cursor
          ? parseInt(req.query.cursor)
          : 0;
        const limit: number = req.query.limit ? parseInt(req.query.limit) : 10;

        const tasks = await this.tasksModel.getAllTasks(cursor, limit);
        const tasksWithLinks = tasks.map((task) =>
          this.addHateoasLinks(task, req)
        );
        res.json(tasksWithLinks);
      } catch (error) {
        throw new AppError("Error getting tasks", 500);
      }
    }
  );

  getTask = asyncHandler(
    async (req: CustomRequest<GetTaskInput>, res: Response) => {
      try {
        const taskId = parseInt(req.params.id);
        const task = await this.tasksModel.getTask(taskId);

        if (!task) {
          return res.status(404).end();
        }
        const taskWithLinks = this.addHateoasLinks(task, req);

        res.json(taskWithLinks);
      } catch (error) {
        throw new AppError("Error getting task", 500);
      }
    }
  );

  createTask = asyncHandler(async (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const newTask = await this.tasksModel.createTask(title, req.userId);

      res.status(201).location(`/api/v1/tasks/${newTask.id}`).json(newTask);
    } catch (error) {
      throw new AppError("Error creating task", 500);
    }
  });

  updateTask = asyncHandler(
    async (req: CustomRequest<UpdateTaskInput>, res: Response) => {
      const { title, done } = req.body;
      const taskId = parseInt(req.params.id);
      try {
        const updatedTask = await this.tasksModel.updateTask(
          taskId,
          req.userId,
          title,
          done
        );
        if (!updatedTask) {
          throw new AppError("Task not found", 404);
        }

        res.status(204).end();
      } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError("Error updating task", 500);
      }
    }
  );

  deleteTask = asyncHandler(
    async (req: CustomRequest<DeleteTaskInput>, res: Response) => {
      try {
        const taskId = parseInt(req.params.id);
        const deletedTask = await this.tasksModel.deleteTask(
          taskId,
          req.userId
        );
        if (!deletedTask) {
          return res.status(404).end();
        }
        res.status(204).end();
      } catch (error) {
        throw new AppError("Error deleting task", 500);
      }
    }
  );
}
