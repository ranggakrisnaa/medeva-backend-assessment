import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "$entities/Error";
import { verifyToken } from "$utils/token.utils";
import { handleServiceErrorWithResponse } from "$utils/response.utils";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return handleServiceErrorWithResponse(res, {
      status: false,
      err: new UnauthorizedError(
        "Authorization header missing or malformed"
      ).toServiceError(),
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return handleServiceErrorWithResponse(res, {
      status: false,
      err: new UnauthorizedError("Token not found").toServiceError(),
    });
  }

  const verify = verifyToken(token);
  if (!verify) {
    return handleServiceErrorWithResponse(res, {
      status: false,
      err: new UnauthorizedError("Invalid or expired token").toServiceError(),
    });
  }

  req.user = verify;
  next();
};

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return handleServiceErrorWithResponse(res, {
        status: false,
        err: new UnauthorizedError("Insufficient permissions").toServiceError(),
      });
    }
    next();
  };
};
