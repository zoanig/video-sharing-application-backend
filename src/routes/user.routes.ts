import { Router } from "express";
import validateRequest from "../middlewares/validateRequest";
import { userSignUpSchema } from "../validators/userSignUp";
import {
  updateProfile,
  userLogin,
  userSignUp,
} from "../controllers/user.controllers";
import { userLoginSchema } from "../validators/userLogin";
import { authorizeUser } from "../middlewares/authorizeUser";

const router = Router();

router.post("/signup", validateRequest(userSignUpSchema), userSignUp);
router.post("/login", validateRequest(userLoginSchema), userLogin);

// router.get("/:userId");
router.put("/profile", authorizeUser(["admin", "user"]), updateProfile);
// router.put("/logout");
// router.post("/refreshToken");
// router.delete("/deleteAccount");

export default router;
