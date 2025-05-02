import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserWithRoleDeliveryPartner,
} from "../../controllers/auth/user.controllers.js";
import { verifyJwt } from "../../middleware/verifyJwt.middleware.js";
import { checkRole } from "../../middleware/rbac.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyJwt, getUserProfile);
router.get(
  "/delivery-partner",
  verifyJwt,
  checkRole("admin"),
  getUserWithRoleDeliveryPartner
);

export default router;
