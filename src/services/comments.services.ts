import mongoose, { Mongoose } from "mongoose";
import { payload } from "../types";
import { Comment } from "../models/comment.model";
import { ApiError } from "../utils/ApiError";

export const creatComment = async (
  id: mongoose.Types.ObjectId,
  user: payload,
  desciption: string,
  isReply: boolean = false
) => {
  try {
    if (isReply) {
      const comment = await Comment.findById(id).orFail();
      const reply = await Comment.create({
        desciption,
        owner: user._id,
        isReply,
        replyTo: id,
        video: comment.video,
      });
      await reply.populate("owner", "username avatar -_id");
      return reply;
    } else {
      const comment = await Comment.create({
        desciption,
        owner: user._id,
        video: id,
      });
      await comment.populate("owner", "username avatar -_id");
      return comment;
    }
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(404, "Comment not found");
    } else {
      throw new ApiError(500, "Error occured while creating comment");
    }
  }
};

export const deleteComment = async (
  id: mongoose.Types.ObjectId,
  user: payload
) => {
  try {
    if (user.role === "admin") {
      await Comment.deleteOne({ _id: id }).orFail();
      return;
    }
    await Comment.deleteOne({ _id: id, owner: user._id }).orFail();
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(401, "Comment not found");
    } else {
      throw new ApiError(500, "Error occured while deleting the comment");
    }
  }
};

export const updateComment = async (
  id: mongoose.Types.ObjectId,
  user: payload,
  desciption: string
) => {
  try {
    if (user.role === "admin") {
      await Comment.updateOne({ _id: id }, { $set: { desciption } }).orFail();
      return;
    }
    await Comment.updateOne(
      { _id: id, owner: user._id },
      { $set: { desciption } }
    ).orFail();
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(401, "Comment not found");
    } else {
      throw new ApiError(500, "Error occured while updating the comment");
    }
  }
};
