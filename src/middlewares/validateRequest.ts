import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";
import { ApiError } from "../utils/ApiError";

export default (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const code = 400;
        return res
          .status(code)
          .json(
            new ApiError(code, "Validation Failed", JSON.parse(err.message))
          );
      } else {
        const code = 500;
        return res.status(code).json(new ApiError(code));
      }
    }
  };
