import mongoose from "mongoose";
import { payload } from "../types";
import { Like } from "../models/like.model";
import { ApiError } from "../utils/ApiError";

export const likeService = async (
  id: mongoose.Types.ObjectId,
  user: payload,
  type: "video" | "comment"
) => {
  try {
    if (await Like.findOne({ [type]: id, likedBy: user._id }))
      throw new ApiError(400, `${type} already liked`);
    const likeDoc = new Like({ [type]: id, likedBy: user._id });
    likeDoc.save();
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    } else {
      throw new ApiError(500, `Error occured while liking the ${type}`);
    }
  }
};

export const unlikeService = async (
  id: mongoose.Types.ObjectId,
  user: payload,
  type: "video" | "comment"
) => {
  try {
    await Like.findByIdAndDelete(id).orFail();
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(
        404,
        `The user's like on provied ${type} doesn't exist`
      );
    } else {
      throw new ApiError(500, `Error occured while unliking the ${type}`);
    }
  }
};
