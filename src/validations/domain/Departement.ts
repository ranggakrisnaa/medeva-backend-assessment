import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { BaseQuerySchema } from "./Employee";
import { commonValidations } from "$utils/uuid_validate.utils";

extendZodWithOpenApi(z);

export const QueryDepartmentSchema = BaseQuerySchema.extend({
  search: z.string().optional().openapi({ example: "Finance" }),
});
export type QueryDepartment = z.infer<typeof QueryDepartmentSchema>;

export const QueryPositionSchema = BaseQuerySchema.extend({
  search: z.string().optional().openapi({ example: "Manager" }),
});
export type QueryPosition = z.infer<typeof QueryPositionSchema>;

export const GetDepartmentByIdSchema = z.object({
  departmentId: commonValidations.id.uuid,
});
