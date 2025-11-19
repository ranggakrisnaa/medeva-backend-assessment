import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import {
  CreateEmployeeSchema,
  GetEmployeeByIdSchema,
  QueryEmployeeSchema,
  UpdateEmployeeSchema,
} from "$validations/domain/Employee";
import { authMiddleware, roleMiddleware } from "$middlewares/authMiddleware";
import { employeeController } from "$controllers/rest";
import { validateRequest } from "$middlewares/validateRequestMiddleware";
import { Role } from "@prisma/client";

export const employeeRegistry = new OpenAPIRegistry();
export const employeeRouter: Router = express.Router({ mergeParams: true });

employeeRegistry.registerPath({
  method: "post",
  path: "/employees",
  description: "Create a new employee",
  summary: "Create Employee",
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateEmployeeSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Employee created successfully",
    },
    400: {
      description: "Bad request",
    },
    401: {
      description: "Unauthorized",
    },
  },
  tags: ["Employee"],
});

employeeRegistry.registerPath({
  method: "get",
  path: "/employees",
  description: "Get all employees",
  summary: "Get All Employees",
  security: [{ bearerAuth: [] }],
  request: {
    query: QueryEmployeeSchema,
  },
  responses: {
    200: {
      description: "Employees retrieved successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
  tags: ["Employee"],
});

employeeRegistry.registerPath({
  method: "get",
  path: "/employees/{id}",
  description: "Get employee by ID",
  summary: "Get Employee By ID",
  security: [{ bearerAuth: [] }],
  request: {
    params: GetEmployeeByIdSchema,
  },
  responses: {
    200: {
      description: "Employee retrieved successfully",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Employee not found",
    },
  },
  tags: ["Employee"],
});

employeeRegistry.registerPath({
  method: "put",
  path: "/employees/{id}",
  description: "Update an existing employee",
  summary: "Update Employee",
  security: [{ bearerAuth: [] }],
  request: {
    params: GetEmployeeByIdSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateEmployeeSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Employee updated successfully",
    },
    400: {
      description: "Bad request",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Employee not found",
    },
  },
  tags: ["Employee"],
});

employeeRegistry.registerPath({
  method: "delete",
  path: "/employees/{id}",
  description: "Delete an employee",
  summary: "Delete Employee",
  security: [{ bearerAuth: [] }],
  request: {
    params: GetEmployeeByIdSchema,
  },
  responses: {
    200: {
      description: "Employee deleted successfully",
    },
    401: {
      description: "Unauthorized",
    },
    404: {
      description: "Employee not found",
    },
  },
  tags: ["Employee"],
});

employeeRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN, Role.USER),
  validateRequest({ query: QueryEmployeeSchema }),
  employeeController.getAllEmployees
);

employeeRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN, Role.USER),
  validateRequest({ params: GetEmployeeByIdSchema }),
  employeeController.getEmployeeById
);

employeeRouter.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validateRequest({ body: CreateEmployeeSchema }),
  employeeController.createEmployee
);

employeeRouter.put(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validateRequest({ body: UpdateEmployeeSchema }),
  employeeController.updateEmployee
);

employeeRouter.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(Role.ADMIN),
  validateRequest({ params: GetEmployeeByIdSchema }),
  employeeController.deleteEmployee
);
