import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

interface DepartmentData {
  name: string;
  positions: string[];
}

interface DepartmentsJSON {
  departments: DepartmentData[];
}

export async function seedDepartments(prisma: PrismaClient) {
  console.log("Starting department seeding...");

  // Read JSON file (ES module compatible)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const jsonPath = path.join(__dirname, "data", "departments.json");
  const jsonData = fs.readFileSync(jsonPath, "utf-8");
  const data: DepartmentsJSON = JSON.parse(jsonData);

  // Create departments and their positions
  for (const dept of data.departments) {
    const existingDept = await prisma.department.findFirst({
      where: { name: dept.name },
    });

    let department;
    if (!existingDept) {
      department = await prisma.department.create({
        data: {
          name: dept.name,
        },
      });
      console.log(`Created department: ${dept.name}`);
    } else {
      department = existingDept;
      console.log(`Department already exists: ${dept.name}`);
    }

    // Create positions for this department
    for (const positionName of dept.positions) {
      const existingPosition = await prisma.position.findFirst({
        where: {
          name: positionName,
          departmentId: department.id,
        },
      });

      if (!existingPosition) {
        await prisma.position.create({
          data: {
            name: positionName,
            departmentId: department.id,
          },
        });
        console.log(`  - Created position: ${positionName}`);
      } else {
        console.log(`  - Position already exists: ${positionName}`);
      }
    }
  }

  console.log("Department seeding completed!");
}
