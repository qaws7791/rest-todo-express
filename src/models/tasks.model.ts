import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class TasksModel {
  readonly MIN_CURSOR = 1;
  readonly CURSOR = 1;
  readonly LIMIT = 10;
  readonly MIN_LIMIT = 1;
  readonly MAX_LIMIT = 100;

  getPaginationParams(cursor?: string, limit?: string) {
    const parsedCursor = cursor ? parseInt(cursor) : this.MIN_CURSOR;
    const parsedLimit = limit ? parseInt(limit) : this.LIMIT;

    return {
      cursor: isNaN(parsedCursor)
        ? this.MIN_CURSOR
        : parsedCursor < this.MIN_CURSOR
        ? this.MIN_CURSOR
        : parsedCursor,
      limit: isNaN(parsedLimit)
        ? this.LIMIT
        : parsedLimit < this.MIN_LIMIT
        ? this.MIN_LIMIT
        : parsedLimit > this.MAX_LIMIT
        ? this.MAX_LIMIT
        : parsedLimit,
    };
  }

  async getAllTasks(userId: number, cursor?: string, limit?: string) {
    const { cursor: parsedCursor, limit: parsedLimit } =
      this.getPaginationParams(cursor, limit);

    const tasks = await prisma.task.findMany({
      skip: cursor ? 1 : undefined,
      cursor: cursor ? { id: parsedCursor } : undefined,
      take: parsedLimit,
      where: {
        userId,
      },
      orderBy: {
        id: "asc",
      },
    });

    return tasks;
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
