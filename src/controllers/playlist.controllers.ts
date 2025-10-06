import { Request, Response } from "express";
import {
  payload,
  playlistCreateType,
  playlistUpdateType,
  videoUpdateParamsType,
} from "../types";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";
import {
  createPlaylist,
  deletePlaylist,
  getAllPlaylistsByUser,
  getPlaylist,
  updatePlaylist,
} from "../services/playlists.services";
import { ApiResponse } from "../utils/ApiResponse";

export const createPlaylistC = async (
  req: Request<{}, {}, playlistCreateType>,
  res: Response
) => {
  try {
    const { title, description } = req.body;
    const videos = req.body.videos.map((id) => new mongoose.Types.ObjectId(id));
    const user = req.user as payload;
    const playlist = await createPlaylist(user, videos, title, description);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Created playlist successfully", { playlist })
      );
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};

export const updatePlaylistC = async (
  req: Request<videoUpdateParamsType, {}, playlistUpdateType>,
  res: Response
) => {
  try {
    const { title, description } = req.body;
    const videos = req.body.videos?.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const removedVids = req.body.removedVids?.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const id = new mongoose.Types.ObjectId(req.params.Id);
    const user = req.user as payload;
    const playlist = await updatePlaylist(id, user, {
      title,
      description,
      videos,
      removedVids,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Updated playlist successfully", { playlist })
      );
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};

export const deletePlaylistC = async (
  req: Request<videoUpdateParamsType, {}, {}>,
  res: Response
) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.Id);
    const user = req.user as payload;
    const result = await deletePlaylist(user, id);
    return res
      .status(200)
      .json(new ApiResponse(200, "Deleted playlist successfully", { result }));
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};

export const getPlaylistC = async (
  req: Request<videoUpdateParamsType, {}, {}>,
  res: Response
) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.Id);
    const playlist = await getPlaylist(id);
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Retrieved playlist successfully", { playlist })
      );
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json(err);
    } else {
      return res.status(500).json(new ApiError(500));
    }
  }
};

export const getPlaylistsByUserC =
  (isProtected: boolean = false) =>
  async (req: Request<videoUpdateParamsType, {}, {}>, res: Response) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params?.Id);
      const user = req.user as payload;
      const playlists = await getAllPlaylistsByUser(user, id, isProtected);
      return res.status(200).json(
        new ApiResponse(200, "Retrieved playlists successfully", {
          playlists,
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
