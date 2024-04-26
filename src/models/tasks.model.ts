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
      },
      orderBy: {
        id: "asc",
      },
    });

    const totalTasks = await prisma.task.count({
      where: {
        userId,
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
      where: { id },
    });
    if (!task) {
      return null;
    }
    return task;
  }

  async createTask(title: string, userId: number) {
    const newTask = await prisma.task.create({ data: { title, userId } });
    return newTask;
  }

  async updateTask(id: number, userId: number, title?: string, done?: boolean) {
    try {
      await prisma.task.update({
        where: { id, userId },
        data: { title, done },
      });
    } catch (error) {
      return null;
    }
    return true;
  }

  async deleteTask(id: number, userId: number) {
    const deletedTask = await prisma.task.deleteMany({
      where: { id, userId },
    });
    if (deletedTask.count === 0) {
      return null;
    }
    return true;
  }
}
