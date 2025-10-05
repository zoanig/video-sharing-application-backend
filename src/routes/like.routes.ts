import { Router } from "express";
import { authorizeUser } from "../middlewares/authorizeUser";
import validateParams from "../middlewares/validateParams";
import { videoUpdateParamsSchema } from "../validators/videoUpdate";
import { like, unLike } from "../controllers/like.controllers";

const router = Router();

router.put(
  "video/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  like("video")
);

router.put(
  "/comment/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  like("comment")
);

router.delete(
  "/video/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  unLike("video")
);

router.delete(
  "/comment/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  unLike("comment")
);

export default router;
