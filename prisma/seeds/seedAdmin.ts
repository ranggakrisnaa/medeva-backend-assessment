import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { BCRYPT } from "../../src/constants/default";

export async function seedAdmin(prisma: PrismaClient) {
  console.log("Starting admin seeding...");
  const countAdmin = await prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });

  if (countAdmin === 0) {
    const hashedPassword = await bcrypt.hash("admin123", BCRYPT.SALT_ROUNDS);

    await prisma.user.create({
      data: {
        username: "Admin",
        password: hashedPassword,
        email: "admin@test.com",
        role: Role.ADMIN,
      },
    });

    console.log("Admin seeded");
  }

  console.log("Admin already seeded");
}
