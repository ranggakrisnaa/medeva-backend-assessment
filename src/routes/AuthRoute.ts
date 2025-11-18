import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { validateRequest } from "$middlewares/validateRequestMiddleware";
import {
  LoginRequestSchema,
  RegisterRequestSchema,
} from "$validations/domain/Auth";
import { authController } from "$controllers/rest";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router({ mergeParams: true });

authRegistry.registerPath({
  method: "post",
  path: "/auth/register",
  description: "User registration endpoint",
  summary: "Register a new user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: RegisterRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "User registered successfully",
    },
    400: {
      description: "Bad request",
    },
  },
  tags: ["Authentication"],
});
authRegistry.registerPath({
  method: "post",
  path: "/auth/login",
  description: "User login endpoint",
  summary: "Login a user",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "User logged in successfully",
    },
    400: {
      description: "Invalid credentials",
    },
  },
  tags: ["Authentication"],
});

authRouter.post(
  "/register",
  validateRequest({ body: RegisterRequestSchema }),
  authController.Register
);
authRouter.post(
  "/login",
  validateRequest({ body: LoginRequestSchema }),
  authController.Login
);
