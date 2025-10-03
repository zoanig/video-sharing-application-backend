import { NextFunction, Request, Response } from "express";
import { payload } from "../types";
import jwt from "jsonwebtoken";

export const softAuthUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.headers["authorization"]?.split(" ")[1];
  if (accessToken) {
    const user = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as payload;
    req.user = user;
  }
  next();
};
