import { PrismaClient } from "@prisma/client";
import { Pagination } from "../types";

const prisma = new PrismaClient();

export default class TasksModel {
  async getAllTasks(
    userId: number,
    { page, limit, query }: { page: number; limit: number; query?: string }
  ) {
    const tasks = await prisma.task.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        userId,
        title: {
          contains: query,
        },
        deletedAt: null,
      },
      orderBy: {
        id: "asc",
      },
      select: {
        deletedAt: false,
        createdAt: true,
        done: true,
        id: true,
        title: true,
        updatedAt: true,
        userId: true,
      },
    });

    const totalTasks = await prisma.task.count({
      where: {
        userId,
        title: {
          contains: query,
        },
        deletedAt: null,
      },
    });
    const totalPages = Math.ceil(totalTasks / limit);

    const pagination: Pagination = {
      totalRecords: totalTasks,
      totalPages,
      currentPage: page,
      lastPage: totalPages,
      limit,
    };

    return {
      tasks,
      pagination,
    };
  }

  async getTask(id: number) {
    const task = await prisma.task.findUnique({
      where: { id, deletedAt: null },
      select: {
        deletedAt: false,
        createdAt: true,
        done: true,
        id: true,
        title: true,
        updatedAt: true,
        userId: true,
      },
    });
    if (!task) {
      return null;
    }
    return task;
  }

  async createTask(title: string, userId: number) {
    const newTask = await prisma.task.create({
      data: { title, userId },
      select: {
        deletedAt: false,
        createdAt: true,
        done: true,
        id: true,
        title: true,
        updatedAt: true,
        userId: true,
      },
    });
    return newTask;
  }

  async updateTask(id: number, userId: number, title?: string, done?: boolean) {
    try {
      await prisma.task.update({
        where: { id, userId },
        data: { title, done },
        select: {
          deletedAt: false,
          createdAt: true,
          done: true,
          id: true,
          title: true,
          updatedAt: true,
          userId: true,
        },
      });
    } catch (error) {
      return null;
    }
    return true;
  }

  async deleteTask(id: number, userId: number) {
    const softDeletedTask = await prisma.task.update({
      where: { id, userId },
      data: {
        deletedAt: new Date(),
      },
    });

    if (!softDeletedTask) {
      return null;
    }
    return true;
  }
}
