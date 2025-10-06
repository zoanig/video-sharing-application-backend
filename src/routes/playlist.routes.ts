import { Router } from "express";
import { authorizeUser } from "../middlewares/authorizeUser";
import validateRequest from "../middlewares/validateRequest";
import {
  playlistCreateSchema,
  playlistUpdateSchema,
} from "../validators/playlist";
import {
  createPlaylistC,
  deletePlaylistC,
  getPlaylistC,
  getPlaylistsByUserC,
  updatePlaylistC,
} from "../controllers/playlist.controllers";
import validateParams from "../middlewares/validateParams";
import { videoUpdateParamsSchema } from "../validators/videoUpdate";

const router = Router();

router.post(
  "/create",
  authorizeUser(["admin", "user"]),
  validateRequest(playlistCreateSchema),
  createPlaylistC
);
router.put(
  "/:Id",
  authorizeUser(["admin", "user"]),
  validateParams(videoUpdateParamsSchema),
  validateRequest(playlistUpdateSchema),
  updatePlaylistC
);
router.delete(
  "/:Id",
  authorizeUser(["admin", "user"]),
  validateParams(videoUpdateParamsSchema),
  deletePlaylistC
);
router.get(
  "/getall",
  authorizeUser(["admin", "user"]),
  getPlaylistsByUserC(true)
);

router.get("/getall/:Id", getPlaylistsByUserC);
router.get("/:Id", getPlaylistC);

export default router;
