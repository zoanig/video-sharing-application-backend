import { Request, Response } from "express";
import { commentType, payload, videoUpdateParamsType } from "../types";
import mongoose, { mongo } from "mongoose";
import {
  creatComment,
  deleteComment,
  updateComment,
} from "../services/comments.services";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const createCommentC =
  (isReply: boolean = false) =>
  async (
    req: Request<videoUpdateParamsType, {}, commentType>,
    res: Response
  ) => {
    try {
      const user = req.user as payload;
      const id = new mongoose.Types.ObjectId(req.params.Id);
      const { desciption } = req.body;
      let comment: mongoose.Document;
      if (isReply) {
        comment = await creatComment(id, user, desciption, isReply);
      } else {
        comment = await creatComment(id, user, desciption);
        return res
          .status(200)
          .json(
            new ApiResponse(200, "Comment Created Successfully", { comment })
          );
      }
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        return res.status(err.statusCode).json(err);
      } else {
        return res.status(500).json(new ApiError(500));
      }
    }
  };

export const deleteCommentC = async (
  req: Request<videoUpdateParamsType, {}, {}>,
  res: Response
) => {
  try {
    const user = req.user as payload;
    const id = new mongoose.Types.ObjectId(req.params.Id);
    await deleteComment(id, user);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Comment deleted Successfully", { commentId: id })
      );
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};

export const updateCommentC = async (
  req: Request<videoUpdateParamsType, {}, commentType>,
  res: Response
) => {
  try {
    const user = req.user as payload;
    const id = new mongoose.Types.ObjectId(req.params.Id);
    const { desciption } = req.body;
    await updateComment(id, user, desciption);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Comment updated Successfully", { commentId: id })
      );
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};
