// src/types/index.d.ts
import "express";
import { UserJWTPayload } from "$entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserJWTPayload;
    }
  }
}
