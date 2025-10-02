import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import validateRequest from "../middlewares/validateRequest";
import { videoUploadSchema } from "../validators/videoUpload";
import {
  deleteVideoC,
  publishVideo,
  updateVideoInfoC,
} from "../controllers/video.controllers";
import { authorizeUser } from "../middlewares/authorizeUser";
import {
  videoUpdateParamsSchema,
  videoUpdateSchema,
} from "../validators/videoUpdate";
import validateParams from "../middlewares/validateParams";
import { videoDeleteSchema } from "../validators/videoDelete";

const router = Router();

router.post(
  "/upload",
  authorizeUser(["user", "admin"]),
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  validateRequest(videoUploadSchema),
  publishVideo
);

router.put(
  "/update/:vidId",
  authorizeUser(["user", "admin"]),
  upload.single("thumbnail"),
  validateParams(videoUpdateParamsSchema),
  validateRequest(videoUpdateSchema),
  updateVideoInfoC
);

router.delete(
  "/delete/:vidId",
  authorizeUser(["user", "admin"]),
  validateRequest(videoDeleteSchema),
  validateParams(videoUpdateParamsSchema),
  deleteVideoC
);

export default router;
