import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../../controllers/products/products.controllers.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;
