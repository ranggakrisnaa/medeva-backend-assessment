import { prisma } from "$pkg/prisma/prisma";

export class PositionRepository {
  constructor(private readonly positionModel = prisma.position) {}

  CountById(id: string) {
    return this.positionModel.count({ where: { id } });
  }
}
