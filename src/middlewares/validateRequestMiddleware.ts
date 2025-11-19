import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodAny } from "zod";

export const validateRequest = (schema: {
  body?: ZodObject;
  query?: ZodObject | ZodAny;
  params?: ZodObject | ZodAny;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        const validatedQuery = await schema.query.parseAsync(req.query);
        // Merge validated query back to req.query using Object.assign
        Object.assign(req.query, validatedQuery);
      }
      if (schema.params) {
        const validatedParams = await schema.params.parseAsync(req.params);
        // Merge validated params back to req.params using Object.assign
        Object.assign(req.params, validatedParams);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
