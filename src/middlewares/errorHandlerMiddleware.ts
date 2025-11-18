import type { Request, Response, NextFunction, RequestHandler } from "express";
import Logger from "$pkg/logger";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { env } from "$utils/config.utils";
import { AppError } from "$entities/Error";

/**
 * Error Handler Middleware
 * Catches all errors thrown in the application
 */
export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: Array<string | Record<string, unknown>> = [];
  let isOperational = false;

  // Handle Custom Application Errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
    isOperational = err.isOperational;
  }
  // Handle Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    message = "Database Error";

    switch (err.code) {
      case "P2002":
        message = "Unique constraint violation";
        errors = [
          {
            field: err.meta?.target,
            message: "A record with this value already exists",
          },
        ];
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        errors = [{ message: "The requested record does not exist" }];
        break;
      case "P2003":
        message = "Foreign key constraint failed";
        errors = [
          {
            field: err.meta?.field_name,
            message: "Related record does not exist",
          },
        ];
        break;
      case "P2014":
        message = "Invalid relation";
        errors = [{ message: "The change violates a required relation" }];
        break;
      default:
        errors = [{ code: err.code, message: err.message }];
    }
    isOperational = true;
  }
  // Handle Prisma Validation Errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errors = [{ message: "Invalid data provided to database" }];
    isOperational = true;
  }
  // Handle Zod Validation Errors
  else if (err instanceof ZodError) {
    statusCode = 422;
    message = "Validation Error";
    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));
    isOperational = true;
  }
  // Handle JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    errors = [{ message: "The provided token is invalid" }];
    isOperational = true;
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
    errors = [{ message: "The provided token has expired" }];
    isOperational = true;
  }
  // Handle Syntax Errors (malformed JSON)
  else if (err.name === "SyntaxError" && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON";
    errors = [{ message: "The request body contains invalid JSON" }];
    isOperational = true;
  }
  // Handle other standard errors
  else {
    message = err.message || message;
  }

  // Store error message and stack in res.locals for morgan middleware
  res.locals.errorMessage = message;
  res.locals.errorStack = err.stack;

  // Log error with full details
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message,
    errors,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    stack: err.stack,
    ...(req.body && Object.keys(req.body).length > 0 && { body: req.body }),
    ...(req.params &&
      Object.keys(req.params).length > 0 && { params: req.params }),
    ...(req.query && Object.keys(req.query).length > 0 && { query: req.query }),
  };

  // Log based on severity
  if (statusCode >= 500) {
    Logger.error(errorLog);
  } else if (statusCode >= 400) {
    Logger.warn(errorLog);
  }

  // Don't expose stack trace in production
  const isDevelopment = env.NODE_ENV;
  const response: {
    content: null;
    message: string;
    errors: Array<string | Record<string, unknown>>;
    stack?: string;
  } = {
    content: null,
    message,
    errors,
  };

  // Only include stack trace in development
  if (isDevelopment && !isOperational) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const message = `Route ${req.method} ${req.originalUrl} not found`;

  Logger.warn({
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    statusCode: 404,
    message,
    ip: req.ip,
  });

  return res.status(404).json({
    content: null,
    message,
    errors: [
      {
        type: "NotFound",
        path: req.originalUrl,
        method: req.method,
      },
    ],
  });
};

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass to error handler
 */
export const asyncHandler = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
