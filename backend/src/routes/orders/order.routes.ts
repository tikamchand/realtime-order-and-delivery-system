import { Router } from "express";
import { verifyJwt } from "../../middleware/verifyJwt.middleware.js";
import { checkRole } from "../../middleware/rbac.middleware.js";
import {
  createOrder,
  getAllOrders,
  getOrderByDeliveryPartnerId,
  getOrdersByUserId,
  // updateOrderStatus,
  getUnassignedOrders,
} from "../../controllers/orders/order.controllers.js";

const router = Router();

router.post("/", verifyJwt, checkRole("customer"), createOrder);
router.get("/", verifyJwt, checkRole("admin"), getAllOrders);
router.get("/user", verifyJwt, checkRole("customer"), getOrdersByUserId);
router.get(
  "/unassigned",
  verifyJwt,
  checkRole("delivery_partner"),
  getUnassignedOrders
);
router.get(
  "/assigned",
  verifyJwt,
  checkRole("delivery_partner"),
  getOrderByDeliveryPartnerId
);
// router.put("/:id", verifyJwt, checkRole("delivery_partner"), updateOrderStatus);

export default router;
