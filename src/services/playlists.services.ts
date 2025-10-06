import mongoose from "mongoose";
import { payload } from "../types";
import { Playlist } from "../models/playlist.model";
import { ApiError } from "../utils/ApiError";

export const createPlaylist = async (
  user: payload,
  videos: mongoose.Types.ObjectId[],
  title: string,
  description?: string
) => {
  try {
    const playlist = await Playlist.create({
      title,
      description,
      videos,
      owner: user._id,
    });
    await playlist.save();
    await playlist.populate([
      { path: "owner", select: "username avatar _id" },
      {
        path: "videos",
        select: "title thumbnail owner",
        populate: { path: "owner", select: "username avatar" },
      },
    ]);
    return playlist;
  } catch (err: unknown) {
    throw new ApiError(500, "Error occured while storing vid in db");
  }
};

export const updatePlaylist = async (
  id: mongoose.Types.ObjectId,
  user: payload,
  updatedInfo: {
    title?: string;
    description?: string;
    videos?: mongoose.Types.ObjectId[];
    removedVids?: mongoose.Types.ObjectId[];
  }
) => {
  try {
    const playlist = await Playlist.findById(id).orFail();

    if (playlist.owner !== user._id || user.role !== "admin") {
      throw new ApiError(401, "Unauthorized: You do not own this playlist");
    }
    if (updatedInfo.title) playlist.title = updatedInfo.title;
    if (updatedInfo.description) playlist.description = updatedInfo.description;

    if (updatedInfo.videos && updatedInfo.videos.length > 0) {
      playlist.videos = Array.from(
        new Set([...playlist.videos, ...updatedInfo.videos.map(String)])
      ).map((id) => new mongoose.Types.ObjectId(id));
    }
    if (updatedInfo.removedVids && updatedInfo.removedVids.length > 0) {
      playlist.videos = playlist.videos.filter(
        (vid) => !updatedInfo.removedVids!.some((r) => r.equals(vid))
      );
    }
    const updated = await playlist.save();
    await updated.populate([
      { path: "owner", select: "username avatar _id" },
      {
        path: "videos",
        select: "title thumbnail owner",
        populate: { path: "owner", select: "username avatar" },
      },
    ]);
    return updated;
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(404, "Playlist Not Found");
    } else if (err instanceof ApiError) {
      throw err;
    } else {
      throw new ApiError(500, "An error occured while updating the playlist");
    }
  }
};

export const deletePlaylist = async (
  user: payload,
  id: mongoose.Types.ObjectId
) => {
  try {
    const result =
      user.role === "admin"
        ? await Playlist.deleteOne({ _id: id })
        : await Playlist.deleteOne({ _id: id, owner: user._id });

    if (result.deletedCount === 0) {
      const exists = await Playlist.exists({ _id: id });
      if (exists) {
        throw new ApiError(
          403,
          "You are not authorized to delete this playlist"
        );
      }
      throw new ApiError(404, "Playlist not found");
    }

    return { success: true, message: "Playlist deleted successfully" };
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(404, "Playlist not found");
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      500,
      "An unexpected error occurred while deleting the playlist"
    );
  }
};

export const getPlaylist = async (id: mongoose.Types.ObjectId) => {
  try {
    const result = await Playlist.findOne({
      _id: id,
      isPrivate: false,
    }).orFail();
    await result.populate([
      { path: "owner", select: "username avatar _id" },
      {
        path: "videos",
        select: "title thumbnail owner",
        populate: { path: "owner", select: "username avatar" },
      },
    ]);
    return result;
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(400, "Playlist not found");
    }
    throw new ApiError(
      500,
      "An unexpected error occurred while getting the playlist"
    );
  }
};

export const getAllPlaylistsByUser = async (
  user?: payload,
  id?: mongoose.Types.ObjectId,
  isProtected: boolean = false
) => {
  try {
    const result = !isProtected
      ? await Playlist.find({ owner: id, isPrivate: false }).orFail()
      : await Playlist.find({ owner: user?._id }).orFail();
    await Playlist.populate(result, [
      { path: "owner", select: "username avatar _id" },
      {
        path: "videos",
        select: "title thumbnail owner",
        populate: { path: "owner", select: "username avatar" },
      },
    ]);
    return result;
  } catch (err: unknown) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      throw new ApiError(400, "Playlists not found");
    }
    throw new ApiError(
      500,
      "An unexpected error occurred while getting the playlists"
    );
  }
};
