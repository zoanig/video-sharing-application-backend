import { Request } from "express";
import { payload } from "../../types";

export declare global {
  namespace Express {
    interface Request {
      user?: payload;
    }
  }
}
