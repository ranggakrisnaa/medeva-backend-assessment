import { AuthController } from "./AuthController";
import { DepartmentController } from "./DepartmentController";
import { EmployeeController } from "./EmployeeController";

export const authController = new AuthController();
export const employeeController = new EmployeeController();
export const departmentController = new DepartmentController();
