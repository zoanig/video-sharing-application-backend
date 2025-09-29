import { Request, Response } from "express";
import { payload, videoUploadType } from "../types";
import { ApiError } from "../utils/ApiError";
import { uploadtoCloudnary } from "../utils/cloudinary";
import { storeVideo } from "../services/video.services";
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
    return res
      .status(201)
      .json(
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
