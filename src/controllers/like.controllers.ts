import { Request, Response } from "express";
import mongoose from "mongoose";
import { payload, videoUpdateParamsType } from "../types";
import { likeService, unlikeService } from "../services/likes.services";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const like =
  (type: "video" | "comment") =>
  async (req: Request<videoUpdateParamsType, {}, {}>, res: Response) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.Id);
      const user = req.user as payload;
      await likeService(id, user, type);
      return res.status(200).json(
        new ApiResponse(200, `${type} Liked Successfully`, {
          [`${type}Id`]: id,
        })
      );
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err);
      } else {
        return res.status(500).json(new ApiError(500));
      }
    }
  };

export const unLike =
  (type: "video" | "comment") =>
  async (req: Request<videoUpdateParamsType, {}, {}>, res: Response) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.Id);
      const user = req.user as payload;
      await unlikeService(id, user, type);
      return res.status(200).json(
        new ApiResponse(200, `${type} Unliked Successfully`, {
          [`${type}Id`]: id,
        })
      );
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err);
      } else {
        return res.status(500).json(new ApiError(500));
      }
    }
  };
