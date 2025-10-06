import { Router } from "express";
import { authorizeUser } from "../middlewares/authorizeUser";
import validateParams from "../middlewares/validateParams";
import { videoUpdateParamsSchema } from "../validators/videoUpdate";
import {
  subscribeC,
  unSubscribeC,
} from "../controllers/subscription.controllers";

const router = Router();

router.put(
  "/:Id",
  authorizeUser(["admin", "user"]),
  validateParams(videoUpdateParamsSchema),
  subscribeC
);
router.delete(
  "/:Id",
  authorizeUser(["admin", "user"]),
  validateParams(videoUpdateParamsSchema),
  unSubscribeC
);

export default router;
