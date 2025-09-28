import { NextFunction, Request, Response } from "express";
import { payload, userRole } from "../types";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";

export const authorizeUser =
  (roles: userRole[]) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers["authorization"]?.split(" ")[1];
      if (!accessToken) {
        return res
          .status(401)
          .json(new ApiError(401, "The user must log in to access this route"));
      }
      const user = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as payload;
      if (!roles.includes(user.role)) {
        return res
          .status(401)
          .json(new ApiError(401, "Insufficient Permissions"));
      }
      req.user = user;
      next();
    } catch (err: unknown) {
      let message = "Something Went Wrong While Verifying Jwt";
      if (err instanceof jwt.TokenExpiredError) {
        message = "Jwt Token is Expired. Log in again or refresh token";
      } else if (err instanceof jwt.JsonWebTokenError) {
        message = "Invalid jwt Token";
      }
      return res.status(401).json(new ApiError(401, message));
    }
  };
