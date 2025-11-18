import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { UserSchema } from "./Models";

extendZodWithOpenApi(z);

export const LoginRequestSchema = UserSchema.pick({
  email: true,
  password: true,
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = UserSchema.pick({
  email: true,
  username: true,
  password: true,
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
