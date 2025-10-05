import mongoose from "mongoose";
import { Video } from "../models/video.model";
import { payload } from "../types";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcrypt";

export const storeVideo = async (
  user: payload,
  videoSrc: string,
  thumbnail: string,
  title: string,
  description?: string
) => {
  const savedVid = new Video({
    videoSrc,
    thumbnail,
    description,
    title,
    owner: user._id,
  });
  await savedVid.save();
  return savedVid;
};

export const getVideoInfo = async (vidId: mongoose.Types.ObjectId) => {
  try {
    return await Video.findById(vidId).orFail();
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(404, "Video Not Found");
    } else {
      throw new ApiError(500, "An error occured while searching the db");
    }
  }
};

export const updateVideoInfo = async (
  vidId: mongoose.Types.ObjectId,
  updtdInfo: { thumbnail?: string; description?: string; title?: string },
  user: payload
) => {
  try {
    const updatingItems = Object.fromEntries(
      Object.entries(updtdInfo).filter(
        ([key, value]) => value !== undefined || null
      )
    );
    const video = await Video.findById(vidId).orFail();
    if (video.owner == user._id || user.role === "admin") {
      const updatedVid = await Video.findByIdAndUpdate(vidId, updatingItems, {
        new: true,
      }).orFail();
      return updatedVid;
    } else {
      throw new ApiError(401, "Unauhorized");
    }
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(404, "Video Not Found");
    } else if (err instanceof ApiError) {
      throw err;
    } else {
      throw new ApiError(500, "An error occured while updating the video");
    }
  }
};

export const deleteVideoFromDb = async (vidId: mongoose.Types.ObjectId) => {
  try {
    const video = await Video.findById(vidId).orFail();
    await Video.findByIdAndDelete(vidId).orFail();
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(404, "No such video exists with the provided id");
    } else {
      throw new ApiError(500);
    }
  }
};

export const viewVideo = async (vidId: mongoose.Types.ObjectId) => {
  try {
    const video = await Video.findById(vidId)
      .populate("owner", "username avatar _id")
      .orFail();
    video.views += 1;
    video.save();
    return video;
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(404, "Video Not Found");
    } else {
      throw new ApiError(500, "Error occured while getting video");
    }
  }
};
