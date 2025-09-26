import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "Username already exists"],
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already exixts"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: String,
    coverImage: String,
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
