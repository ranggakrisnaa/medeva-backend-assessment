import { prisma } from "../../src/pkg/prisma/prisma";
import { seedAdmin } from "./seedAdmin";
import { seedDepartments } from "./seedDepartemen";

async function seed() {
  await seedAdmin(prisma);
  await seedDepartments(prisma);
}

seed().then(() => {
  console.log("ALL SEEDING DONE");
});
