import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class TasksModel {
  readonly CURSOR = 0;
  readonly LIMIT = 10;

  async getAllTasks(cursor?: number, limit?: number) {
    const tasks = await prisma.task.findMany({
      where: {
        id: {
          gt: cursor || this.CURSOR,
        },
      },
      take: limit || this.LIMIT,
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
