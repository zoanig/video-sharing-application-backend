import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import { userSignUpSchema } from "../validators/userSignUp";
import {
  refreshUserToken,
  updateProfile,
  userLogin,
  userSignUp,
} from "../controllers/user.controllers";
import { userLoginSchema } from "../validators/userLogin";
import { authorizeUser } from "../middlewares/authorizeUser";
import { refreshTokenSchema } from "../validators/refreshToken";

const router = Router();

router.post("/signup", validateRequest(userSignUpSchema), userSignUp);
router.post("/login", validateRequest(userLoginSchema), userLogin);
router.put("/refresh", validateRequest(refreshTokenSchema), refreshUserToken);
// router.get("/:userId");
router.put("/profile", authorizeUser(["admin", "user"]), updateProfile);
// router.put("/logout");
// router.delete("/deleteAccount");

export default router;
