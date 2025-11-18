/**
 * Base Application Error
 * Used for operational errors that should be handled gracefully
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errors: Array<string | Record<string, unknown>>;

  constructor(
    message: string,
    statusCode: number = 500,
    errors: Array<string | Record<string, unknown>> = [],
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Convert AppError to ServiceError format
   * @returns ServiceError object with message and code
   */
  toServiceError(): { message: string; code: number } {
    return {
      message: this.message,
      code: this.statusCode,
    };
  }
}

/**
 * Bad Request Error (400)
 */
export class BadRequestError extends AppError {
  constructor(
    message: string = "Bad Request",
    errors: Array<string | Record<string, unknown>> = [],
  ) {
    super(message, 400, errors);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Unauthorized Error (401)
 */
export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized",
    errors: Array<string | Record<string, unknown>> = [],
  ) {
    super(message, 401, errors);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden Error (403)
 */
export class ForbiddenError extends AppError {
  constructor(
    message: string = "Forbidden",
    errors: Array<string | Record<string, unknown>> = [],
  ) {
    super(message, 403, errors);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Not Found Error (404)
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = "Not Found",
    errors: Array<string | Record<string, unknown>> = [],
  ) {
    super(message, 404, errors);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict Error (409)
 */
export class ConflictError extends AppError {
  constructor(
    message: string = "Conflict",
    errors: Array<string | Record<string, unknown>> = [],
  ) {
    super(message, 409, errors);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Unprocessable Entity Error (422)
 */
export class UnprocessableEntityError extends AppError {
  constructor(
    message: string = "Unprocessable Entity",
    errors: Array<string | Record<string, unknown>> = [],
  ) {
    super(message, 422, errors);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal Server Error",
    errors: Array<string | Record<string, unknown>> = [],
  ) {
    super(message, 500, errors, false);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
