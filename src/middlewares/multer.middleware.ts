import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";
import { ApiError } from "../utils/ApiError";
import { allowedMimeTypes } from "../constants";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Invalid file type. Only images/videos allowed.")
    );
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
});
