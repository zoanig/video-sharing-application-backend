import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    isPrivate: {
      type: Boolean,
      default: false,
    },
    videos: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);
