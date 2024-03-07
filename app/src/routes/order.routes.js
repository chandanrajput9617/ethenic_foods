import express, { Router } from "express";
import {
  orderProductPaymentWithStripe,
  orderSuccess,
  stripeWebHookHandler,
  getAllOrder,
  updateOrderStatus,
} from "../controllers/order/order.controller.js";

const router = Router();
import { userAuth } from "../middlewares/userAuth.js";
router.route("/").get(getAllOrder);
router.route("/create-order/:id").post(userAuth, orderProductPaymentWithStripe);
router.route("/update-order-status/:id").put(updateOrderStatus);
router
  .route("/stripe-webhook")
  .post(express.raw({ type: "application/json" }), stripeWebHookHandler);

export default router;
