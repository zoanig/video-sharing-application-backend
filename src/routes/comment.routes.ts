import { Router } from "express";
import { authorizeUser } from "../middlewares/authorizeUser";
import validateRequest from "../middlewares/validateRequest";
import validateParams from "../middlewares/validateParams";
import { videoUpdateParamsSchema } from "../validators/videoUpdate";
import { commentSchema } from "../validators/comment";
import {
  createCommentC,
  deleteCommentC,
  updateCommentC,
} from "../controllers/comment.controllers";

const router = Router();

router.post(
  "/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  validateRequest(commentSchema),
  createCommentC
);

router.post(
  "/reply/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  validateRequest(commentSchema),
  createCommentC(true)
);

router.delete(
  "/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  deleteCommentC
);

router.put(
  "/:Id",
  authorizeUser(["user", "admin"]),
  validateParams(videoUpdateParamsSchema),
  validateRequest(commentSchema),
  updateCommentC
);
export default router;
