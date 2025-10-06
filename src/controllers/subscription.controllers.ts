import { Request, Response } from "express";
import mongoose from "mongoose";
import { payload, videoUpdateParamsType } from "../types";
import { subscribe, unSubscribe } from "../services/subscription.services";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const subscribeC = async (
  req: Request<videoUpdateParamsType, {}, {}>,
  res: Response
) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.Id);
    const user = req.user as payload;
    const result = subscribe(id, user);
    return res.status(200).json(new ApiResponse(200, "Success", { result }));
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};

export const unSubscribeC = async (
  req: Request<videoUpdateParamsType, {}, {}>,
  res: Response
) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.Id);
    const user = req.user as payload;
    const result = unSubscribe(id, user);
    return res.status(200).json(new ApiResponse(200, "Success", { result }));
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};
