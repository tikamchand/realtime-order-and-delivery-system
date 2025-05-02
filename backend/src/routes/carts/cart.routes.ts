import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt.middleware.js";
import { checkRole } from "../../middleware/rbac.middleware.js";
import {
  addToCart,
  getCart,
} from "../../controllers/carts/cart.controllers.js";

const router = Router();

router.get("/", verifyJwt, checkRole("customer"), getCart);
router.post("/", verifyJwt, checkRole("customer"), addToCart);
export default router;
