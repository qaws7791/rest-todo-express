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
import { CustomRequest, Pagination } from "../types";
import { parsePaginationParams } from "../utils/pagination";

export default class TasksController {
  private tasksModel: TasksModel;

  constructor() {
    this.tasksModel = new TasksModel();
  }

  private hateoasifyTask = (task: TaskDto, req: Request) => {
    const url = this.getUrl(req);
    const resourceUrl = `${url}/${task.id}`;
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

  private getUrl(req: Request) {
    return `${req.protocol}://${req.get("host")}/api/v1/tasks`;
  }

  private hateoasifyTasks = (tasks: TaskDto[], req: Request) => {
    const newTasks = tasks.map((task) => this.hateoasifyTask(task, req));
    return newTasks;
  };

  private addHateoasLinks = (task: TaskDto | TaskDto[], req: Request) => {
    if (Array.isArray(task)) {
      return this.hateoasifyTasks(task, req);
    }
    return this.hateoasifyTask(task, req);
  };

  private paginationLinks = (
    req: Request,
    pagination: Pagination,
    query?: string
  ) => {
    const url = this.getUrl(req);
    const links: HateoasLinks[] = [
      {
        rel: "self",
        href: `${url}?page=${pagination.currentPage}&limit=${pagination.limit}${
          query ? `&query=${query}` : ""
        }`,
        action: "GET",
      },
    ];

    if (pagination.currentPage > 1) {
      links.push(
        {
          rel: "first",
          href: `${url}?page=1&limit=${pagination.limit}${
            query ? `&query=${query}` : ""
          }`,
          action: "GET",
        },
        {
          rel: "prev",
          href: `${url}?page=${pagination.currentPage - 1}&limit=${
            pagination.limit
          }${query ? `&query=${query}` : ""}`,
          action: "GET",
        }
      );
    }

    if (pagination.currentPage < pagination.totalPages) {
      links.push(
        {
          rel: "next",
          href: `${url}?page=${pagination.currentPage + 1}&limit=${
            pagination.limit
          }${query ? `&query=${query}` : ""}`,
          action: "GET",
        },
        {
          rel: "last",
          href: `${url}?page=${pagination.totalPages}&limit=${
            pagination.limit
          }${query ? `&query=${query}` : ""}`,
          action: "GET",
        }
      );
    }

    return links;
  };

  getAllTasks = asyncHandler(
    async (
      req: CustomRequest<GetTaskPaginationInput>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { query } = req.query;
        const params = parsePaginationParams(req.query.page, req.query.limit);
        if (!params) {
          return next(
            new AppError({
              name: "Bad request",
              statusCode: 400,
              message: "Invalid query parameters",
            })
          );
        }

        const { page, limit } = params;

        const { tasks, pagination } = await this.tasksModel.getAllTasks(
          req.userId,
          { page, limit, query }
        );
        const tasksWithLinks = tasks.map((task) =>
          this.addHateoasLinks(task, req)
        );

        const links = this.paginationLinks(req, pagination, query);

        res.json({
          data: tasksWithLinks,
          pagination,
          links,
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
    },
  };
}
