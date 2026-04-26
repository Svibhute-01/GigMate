import { Router } from "express";
import {
  createOrder,
  listMyOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authRequired, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, listMyOrders);
router.post("/", authRequired, requireRole("client"), createOrder);
router.patch("/:id/status", authRequired, updateOrderStatus);

export default router;
