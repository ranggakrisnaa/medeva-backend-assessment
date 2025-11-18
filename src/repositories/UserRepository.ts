import { prisma } from "$pkg/prisma/prisma";
import { Prisma } from "@prisma/client";

export class UserRepository {
  constructor(private readonly userModel = prisma.user) {}

  FindByEmail(email: string) {
    return this.userModel.findUnique({ where: { email } });
  }

  Create(data: Prisma.UserCreateInput) {
    return this.userModel.create({ data });
  }

  Update(id: string, data: Prisma.UserUpdateInput) {
    return this.userModel.update({ where: { id }, data });
  }

  FindById(id: string) {
    return this.userModel.findUnique({ where: { id } });
  }

  CountByEmail(email: string, exCludeUserId?: string) {
    return this.userModel.count({
      where: { email, ...(exCludeUserId && { NOT: { id: exCludeUserId } }) },
    });
  }

  CountByUsername(username: string, exCludeUserId?: string) {
    return this.userModel.count({
      where: { username, ...(exCludeUserId && { NOT: { id: exCludeUserId } }) },
    });
  }
}
