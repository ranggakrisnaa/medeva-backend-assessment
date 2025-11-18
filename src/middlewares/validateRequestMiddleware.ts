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
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
