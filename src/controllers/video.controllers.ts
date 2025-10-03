import { Request, Response } from "express";
import {
  payload,
  videoUpdateParamsType,
  videoUpdateType,
  videoUploadType,
} from "../types";
import { ApiError } from "../utils/ApiError";
import {
  deleteFromCloudinary,
  getPublicId,
  uploadtoCloudnary,
} from "../utils/cloudinary";
import {
  deleteVideoFromDb,
  getVideoInfo,
  storeVideo,
  updateVideoInfo,
} from "../services/video.services";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse";

export const publishVideo = async (
  req: Request<{}, {}, videoUploadType>,
  res: Response
) => {
  try {
    const { title, description } = req.body;
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };
    if (!files || !files.videoFile || !files.videoFile[0]) {
      return res.status(400).json(new ApiError(400, "Video file is required"));
    }
    if (!files.thumbnail || !files.thumbnail[0]) {
      return res
        .status(400)
        .json(new ApiError(400, "Thumbnail image is required"));
    }
    const videoFile = files.videoFile[0];
    const thumbnail = files.thumbnail[0];

    const uploadedVideo = await uploadtoCloudnary(videoFile.path, "video");
    const uploadedThumbail = await uploadtoCloudnary(
      thumbnail.path,
      "thumbnail"
    );

    const savedVid = await storeVideo(
      req.user as payload,
      uploadedVideo.url,
      uploadedThumbail.url,
      title,
      description
    );
    return res.status(201).json(
      new ApiResponse(201, "File Uploaded Successfully", {
        videoId: savedVid._id,
      })
    );
  } catch (err: unknown) {
    let message = "Something Went Wrong";
    let code = 500;
    if (err instanceof Error && err.message === "cloudinaryErr") {
      message = "Error Occured while uploading to cloudinary";
    } else if (err instanceof mongoose.Error) {
      message = "Error occured while storing vid in db";
    }
    return res.status(code).json(new ApiError(code, message, [err]));
  }
};

export const updateVideoInfoC = async (
  req: Request<videoUpdateParamsType, {}, videoUpdateType>,
  res: Response
) => {
  try {
    const vidId = new mongoose.Types.ObjectId(req.params.vidId);
    const { title, description } = req.body;
    const thumbnail = req.file;
    const user = req.user;
    if (title || description || thumbnail) {
      const updatePayload: Record<string, any> = {};

      if (title) updatePayload.title = title;
      if (description) updatePayload.description = description;

      if (thumbnail) {
        const videoInfo = await getVideoInfo(vidId);
        await deleteFromCloudinary(getPublicId(videoInfo.thumbnail));
        const updatedThumbnail = await uploadtoCloudnary(
          thumbnail.path,
          "thumbnail"
        );
        updatePayload.thumbnail = updatedThumbnail.url;
      }

      const updatedVideo = await updateVideoInfo(
        vidId,
        updatePayload,
        user as payload
      );

      return res
        .status(200)
        .json(
          new ApiResponse(200, "Successfully updated the video Info", { vidId })
        );
    } else {
      throw new ApiError(400, "Nothing to update");
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else if (
      err instanceof Error &&
      (err.message === "cloudinaryErr" || err.message === "cloudinaryDelErr")
    ) {
      return res.status(500).json(new ApiError(500, "cloudinary error"));
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};

export const deleteVideoC = async (
  req: Request<videoUpdateParamsType, {}, {}>,
  res: Response
) => {
  try {
    const user = req.user as payload;
    const vidId = new mongoose.Types.ObjectId(req.params.vidId);
    const videoInfo = await getVideoInfo(vidId);
    if (videoInfo.owner == user._id || user.role === "admin") {
      await deleteFromCloudinary(getPublicId(videoInfo.videoSrc), "video");
      await deleteFromCloudinary(getPublicId(videoInfo.thumbnail));
      await deleteVideoFromDb(vidId);
      return res
        .status(200)
        .json(new ApiResponse(200, "Video Deleted Successfully", { vidId }));
    } else {
      throw new ApiError(401, "Unauthorized");
    }
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else if (err instanceof Error && err.message === "cloudinaryDelErr") {
      return res.status(500).json(new ApiError(500, "cloudinary error"));
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};
