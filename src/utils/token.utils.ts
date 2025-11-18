import { UserJWTPayload } from "$entities/User";
import jwt from "jsonwebtoken";
import { env } from "$utils/config.utils";
import crypto from "crypto";

export function verifyToken(token: string): UserJWTPayload {
  try {
    const { key } = keyAndExpiresIn();
    return jwt.verify(token, key) as UserJWTPayload;
  } catch (err) {
    throw new Error(`Invalid or expired token: ${err}`);
  }
}

export function createToken(payload: UserJWTPayload): string {
  const { key, expiresIn } = keyAndExpiresIn();
  return jwt.sign(payload, key, { expiresIn });
}

function hashSecret(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function keyAndExpiresIn() {
  const secretKey = env.JWT_SECRET;
  const expiresIn = env.JWT_EXPIRATION;

  return { key: hashSecret(secretKey), expiresIn };
}
