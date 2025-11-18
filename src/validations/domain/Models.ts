import { z } from "zod";
import {
  OpenAPIRegistry,
  extendZodWithOpenApi,
} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const modelsRegistry = new OpenAPIRegistry();

// Base schemas
export const DepartmentSchema = z
  .object({
    id: z
      .uuid()
      .optional()
      .openapi({ example: "8b7a2f26-6b7c-4a0b-9a6e-0e6c2f1a2b3c" }),
    name: z.string().min(1).openapi({ example: "Keuangan" }),
    createdAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:00:00.000Z" }),
    updatedAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:05:00.000Z" }),
  })
  .openapi("Department");

export const PositionSchema = z
  .object({
    id: z
      .uuid()
      .optional()
      .openapi({ example: "e5c0d2e2-6d9f-4b2a-b1b8-4d6a0b6a5e9f" }),
    name: z.string().min(1).openapi({ example: "Manajer Keuangan" }),
    departmentId: z
      .string()
      .uuid()
      .openapi({ example: "8b7a2f26-6b7c-4a0b-9a6e-0e6c2f1a2b3c" }),
    createdAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:00:00.000Z" }),
    updatedAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:05:00.000Z" }),
  })
  .openapi("Position");

export const EmployeeSchema = z
  .object({
    id: z
      .string()
      .uuid()
      .optional()
      .openapi({ example: "b2f7b1a1-2c3d-4e5f-8a9b-1c2d3e4f5a6b" }),
    userId: z.string().uuid().nullable().optional().openapi({ example: null }),
    nik: z.string().openapi({ example: "EMP-2025-0001" }),
    fullName: z.string().openapi({ example: "Budi Santoso" }),
    placeOfBirth: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "Jakarta" }),
    dateOfBirth: z.iso
      .date()
      .nullable()
      .optional()
      .openapi({ example: "1995-05-20" }),
    address: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "Jl. Merdeka No. 10, Jakarta" }),
    phone: z
      .string()
      .nullable()
      .optional()
      .openapi({ example: "+62-812-3456-7890" }),
    positionId: z
      .uuid()
      .openapi({ example: "e5c0d2e2-6d9f-4b2a-b1b8-4d6a0b6a5e9f" }),
    departmentId: z
      .uuid()
      .openapi({ example: "8b7a2f26-6b7c-4a0b-9a6e-0e6c2f1a2b3c" }),
    avatarUrl: z
      .url()
      .nullable()
      .optional()
      .openapi({ example: "https://example.com/avatar.png" }),
    isActive: z.boolean().optional().openapi({ example: true }),
    createdAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:00:00.000Z" }),
    updatedAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:05:00.000Z" }),
  })
  .openapi("Employee");

export const UserSchema = z
  .object({
    id: z
      .uuid()
      .optional()
      .openapi({ example: "f1a2b3c4-d5e6-7890-abcd-ef1234567890" }),
    email: z.email().openapi({ example: "johndoe@example.com" }),
    username: z.string().min(3).max(30).openapi({ example: "john_doe" }),
    password: z.string().min(6).openapi({ example: "john1234" }),
    role: z.enum(["USER", "ADMIN"]).openapi({ example: "ADMIN" }),
    createdAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:00:00.000Z" }),
    updatedAt: z.iso
      .datetime()
      .optional()
      .openapi({ example: "2025-11-18T09:05:00.000Z" }),
  })
  .openapi("User");

// Register to components so they appear under Models
modelsRegistry.register("User", UserSchema);
modelsRegistry.register("Employee", EmployeeSchema);
modelsRegistry.register("Department", DepartmentSchema);
modelsRegistry.register("Position", PositionSchema);
