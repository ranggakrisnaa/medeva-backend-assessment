import morgan from "morgan";
import type { Request, Response } from "express";

import Logger from "$pkg/logger";
import { env } from "$utils/config.utils";

// Skip all the Morgan http log if the
// application is not running in development mode.
const skip = () => {
  const envNode = env.NODE_ENV || "development";
  return envNode !== "development";
};

// Build the morgan middleware with JSON format
const morganMiddleware = morgan(
  (tokens, req: Request, res: Response) => {
    const logData = {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      contentLength: tokens.res(req, res, "content-length"),
      responseTime: `${tokens["response-time"](req, res)}ms`,
      ip: req.ip || "-",
      userAgent: req.get("user-agent") || "-",
      errorMessage: res.locals.errorMessage || undefined,
    };

    Logger.http(logData);
    return null;
  },
  { skip }
);

export default morganMiddleware;
