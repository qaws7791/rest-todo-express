import bcrypt from "bcrypt";
import prisma from "../prisma/client";

export default class UserModel {
  async createUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async findUser(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
