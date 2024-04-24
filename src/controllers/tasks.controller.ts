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
  PatchTaskInput,
  PutTaskInput,
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
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error getting tasks",
        });
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
          return next(
            new AppError({
              name: "Not found",
              statusCode: 404,
              message: "Task not found",
            })
          );
        }
        const taskWithLinks = this.addHateoasLinks(task, req);

        res.json({
          data: taskWithLinks,
        });
      } catch (error) {
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error getting task",
        });
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

      try {
        const newTask = await this.tasksModel.createTask(title, req.userId);

        res.status(201).location(`/api/v1/tasks/${newTask.id}`).json(newTask);
      } catch (error) {
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error creating task",
        });
      }
    }
  );

  putTask = asyncHandler(
    async (
      req: CustomRequest<PutTaskInput>,
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
          return next(
            new AppError({
              name: "Not found",
              statusCode: 404,
              message: "Task not found",
            })
          );
        }

        res.status(204).end();
      } catch (error) {
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error updating task",
        });
      }
    }
  );

  updateTask = asyncHandler(
    async (
      req: CustomRequest<PatchTaskInput>,
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
          return next(
            new AppError({
              name: "Not found",
              statusCode: 404,
              message: "Task not found",
            })
          );
        }

        res.status(204).end();
      } catch (error) {
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error updating task",
        });
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
          return next(
            new AppError({
              name: "Not found",
              statusCode: 404,
              message: "Task not found",
            })
          );
        }
        res.status(204).end();
      } catch (error) {
        throw new AppError({
          name: "Internal server error",
          statusCode: 500,
          message: "Error deleting task",
        });
      }
    }
  );

  invalidMethod = {
    "/": (req: Request, res: Response, next: NextFunction) => {
      next(
        new AppError({
          name: "Method not allowed",
          statusCode: 405,
          message: "Invalid method",
          headers: { Allow: "GET, POST" },
        })
      );
    },
    "/:id": (req: Request, res: Response, next: NextFunction) => {
      next(
        new AppError({
          name: "Method not allowed",
          statusCode: 405,
          message: "Invalid method",
          headers: { Allow: "GET, PATCH, DELETE" },
        })
      );

      // res
      //   .header("Allow", "GET, PATCH, DELETE")
      //   .status(405)
      //   .json({
      //     error: {
      //       code: 405,
      //       name: "Method not allowed",
      //       details: "Invalid method",
      //     },
      //   });
    },
  };
}
