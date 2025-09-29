import { Router } from "express";
import { upload } from "../middlewares/multer.middleware";
import validateRequest from "../middlewares/validateRequest";
import { videoUploadSchema } from "../validators/videoUpload";
import { publishVideo } from "../controllers/video.controllers";
import { authorizeUser } from "../middlewares/authorizeUser";

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

export default router;
