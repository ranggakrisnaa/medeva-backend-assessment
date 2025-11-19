import { AuthService } from "$services/AuthService";
import { DepartmentService } from "./DepartmentService";
import { EmployeeService } from "./EmployeeService";

// export service
export const authService = new AuthService();
export const employeeService = new EmployeeService();
export const departmentService = new DepartmentService();
