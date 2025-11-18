import { join } from "path";

export const paths = {
  $controllers: join(import.meta.dirname, "controllers"),
  $middlewares: join(import.meta.dirname, "middlewares"),
  $routes: join(import.meta.dirname, "routes"),
  $utils: join(import.meta.dirname, "utils"),
  $services: join(import.meta.dirname, "services"),
  $models: join(import.meta.dirname, "models"),
};
