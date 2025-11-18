import { PrismaClient, Role } from "@prisma/client";
import { hashPassword } from "../../src/utils/hash.utils";

export async function seedAdmin(prisma: PrismaClient) {
  console.log("Starting admin seeding...");
  const countAdmin = await prisma.user.count({
    where: {
      role: "ADMIN",
    },
  });

  if (countAdmin === 0) {
    const hashedPassword = await hashPassword("admin123");

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
