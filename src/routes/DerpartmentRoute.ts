import { departmentController } from "$controllers/rest";
import { authMiddleware, roleMiddleware } from "$middlewares/authMiddleware";
import { validateRequest } from "$middlewares/validateRequestMiddleware";
import {
  GetDepartmentByIdSchema,
  QueryDepartmentSchema,
  QueryPositionSchema,
} from "$validations/domain/Departement";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Role } from "@prisma/client";
import express, { Router } from "express";

export const departementRegistry = new OpenAPIRegistry();
export const departmentRouter: Router = express.Router({ mergeParams: true });

departementRegistry.registerPath({
  method: "get",
  path: "/departments",
  description: "Get all departements",
  summary: "Get All Departements",
  security: [{ bearerAuth: [] }],
  request: {
    query: QueryDepartmentSchema,
  },
  responses: {
    200: {
      description: "Departements retrieved successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
  tags: ["Departement"],
});

departementRegistry.registerPath({
  method: "get",
  path: "/departments/{departmentId}/positions",
  description: "Get all positions by department ID",
  summary: "Get All Positions by Department ID",
  security: [{ bearerAuth: [] }],
  request: {
    query: QueryPositionSchema,
    params: GetDepartmentByIdSchema,
  },
  responses: {
    200: {
      description: "Positions retrieved successfully",
    },
    401: {
      description: "Unauthorized",
    },
  },
  tags: ["Departement"],
});

departmentRouter.get(
  "/",
  authMiddleware,
  roleMiddleware(Role.ADMIN, Role.USER),
  validateRequest({ query: QueryDepartmentSchema }),
  departmentController.getAllDepartments
);

departmentRouter.get(
  "/:departmentId/positions",
  authMiddleware,
  roleMiddleware(Role.ADMIN, Role.USER),
  validateRequest({
    query: QueryPositionSchema,
    params: GetDepartmentByIdSchema,
  }),
  departmentController.getAllPositions
);
