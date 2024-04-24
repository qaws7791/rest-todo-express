import { NextFunction, Request, Response } from "express";
import TasksModel from "../models/tasks.model";
import { TaskDto } from "../dtos/task.dto";
import { HateoasLinks } from "../dtos/common.dto";
import asyncHandler from "../utils/asyncHandler";
import { AppError } from "../utils/appError";
import {
  CreateTaskInput,
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
        action: "PATCH",
        types: ["application/json", "application/merge-patch+json"],
      },
      { rel: "delete", href: resourceUrl, action: "DELETE" },
    ];
    return { ...task, links };
  };

  getAllTasks = asyncHandler(
    async (req: CustomRequest<GetTaskPaginationInput>, res: Response) => {
      try {
        const { cursor, limit } = req.query;
        console.log(req.userId);
        const tasks = await this.tasksModel.getAllTasks(
          req.userId,
          cursor,
          limit
        );
        const tasksWithLinks = tasks.map((task) =>
          this.addHateoasLinks(task, req)
        );
        res.json({
          data: tasksWithLinks,
        });
      } catch (error) {
        throw new AppError("Error getting tasks", 500);
      }
    }
  );

  getTask = asyncHandler(
    async (
      req: CustomRequest<GetTaskInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const taskId = parseInt(req.params.id);
        const task = await this.tasksModel.getTask(taskId);

        if (!task) {
          return next(new AppError("Task not found", 404));
        }
        const taskWithLinks = this.addHateoasLinks(task, req);

        res.json({
          data: taskWithLinks,
        });
      } catch (error) {
        throw new AppError("Error getting task", 500);
      }
    }
  );

  createTask = asyncHandler(
    async (
      req: CustomRequest<CreateTaskInput>,
      res: Response,
      next: NextFunction
    ) => {
      const { title } = req.body;
      if (!title) {
        return next(new AppError("Title is required", 400));
      }

      try {
        const newTask = await this.tasksModel.createTask(title, req.userId);

        res.status(201).location(`/api/v1/tasks/${newTask.id}`).json(newTask);
      } catch (error) {
        throw new AppError("Error creating task", 500);
      }
    }
  );

  updateTask = asyncHandler(
    async (
      req: CustomRequest<UpdateTaskInput>,
      res: Response,
      next: NextFunction
    ) => {
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
          return next(new AppError("Task not found", 404));
        }

        res.status(204).end();
      } catch (error) {
        throw new AppError("Error updating task", 500);
      }
    }
  );

  deleteTask = asyncHandler(
    async (
      req: CustomRequest<DeleteTaskInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const taskId = parseInt(req.params.id);
        const deletedTask = await this.tasksModel.deleteTask(
          taskId,
          req.userId
        );
        if (!deletedTask) {
          return next(new AppError("Task not found", 404));
        }
        res.status(204).end();
      } catch (error) {
        throw new AppError("Error deleting task", 500);
      }
    }
  );
}
