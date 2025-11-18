/* eslint-disable no-undef */
/* eslint-disable no-console */
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  // SERVER
  NODE_LOCAL_PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  ALLOWED_ORIGINS: z.string(),

  // DB
  DATABASE_URL: z.string(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_EXPIRATION: z.coerce.number(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const errorMessages = parsedEnv.error.issues.map(
    (issue) => `❌ ${issue.path.join(".")}: ${issue.message}`
  );

  console.error("🚨 Environment Validation Failed:");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  errorMessages.forEach((msg) => console.error(msg));
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("Please check your .env file and try again.");

  process.exit(1);
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === "development",
  isProduction: parsedEnv.data.NODE_ENV === "production",
  isTest: parsedEnv.data.NODE_ENV === "test",
};
