import express, { Request, Response } from "express";
import cors from "cors";
import {
  errorHandlerMiddleware,
  notFoundHandler,
  morganMiddleware,
} from "$middlewares/index";
import { response_success } from "$utils/response.utils";
import { openAPIRouter } from "$pkg/swagger/openAPIRouter";
import { authRouter } from "$routes/AuthRoute";
import { env } from "$utils/config.utils";

export default function createRestServer() {
  let allowedOrigins: string[] = ["*"];
  const corsOptions: cors.CorsOptions = {};
  if (env.NODE_ENV != "development") {
    allowedOrigins = env.ALLOWED_ORIGINS.split(",");
    corsOptions.origin = allowedOrigins;
  }

  const app = express();
  app.get("/", (req: Request, res: Response) => {
    return response_success(res, "main routes!");
  });
  app.use(cors(corsOptions));
  app.use(morganMiddleware);
  app.use(express.json());

  // API Versioning
  const v1Routes = express.Router();
  app.use("/api-docs", openAPIRouter);
  app.use("/api/v1", v1Routes);

  v1Routes.use("/auth", authRouter);

  app.use(notFoundHandler);
  app.use(errorHandlerMiddleware);

  return app;
}
