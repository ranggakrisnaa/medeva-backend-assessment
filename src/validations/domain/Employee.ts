import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { EmployeeSchema, UserSchema } from "./Models";
import { commonValidations } from "$utils/uuid_validate.utils";

extendZodWithOpenApi(z);

export const BaseQuerySchema = z.object({
  limit: z.number().optional().openapi({ example: 10 }),
  page: z.number().optional().openapi({ example: 1 }),
});

export const GetEmployeeByIdSchema = z.object({
  id: commonValidations.id.uuid,
});

export const QueryEmployeeSchema = BaseQuerySchema.extend({
  search: z.string().optional().openapi({ example: "budi" }),
  status: z
    .enum(["active", "inactive"])
    .optional()
    .openapi({ example: "active" }),
  positionId: z
    .uuid()
    .optional()
    .openapi({ example: "e5c0d2e2-6d9f-4a2a-b1b8-4d6a0b6a5e9f" }),
  sortBy: z
    .enum(["fullName", "nik", "createdAt", "updatedAt"])
    .optional()
    .openapi({ example: "fullName" }),
  sortOrder: z.enum(["asc", "desc"]).optional().openapi({ example: "asc" }),
});
export type QueryEmployee = z.infer<typeof QueryEmployeeSchema>;

export const CreateEmployeeSchema = z.object({
  employee: EmployeeSchema.omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  }),
  user: UserSchema.omit({
    id: true,
    role: true,
    createdAt: true,
    updatedAt: true,
  }),
});
export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = z
  .object({
    employee: EmployeeSchema.omit({
      id: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    }).partial(),
    user: UserSchema.omit({
      id: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }).partial(),
  })
  .partial();
export type UpdateEmployeeRequest = z.infer<typeof UpdateEmployeeSchema>;
