import { Router } from "express";
import {
  createFixedShippingPrice,
  getAllFixedShippingPrices,
  getOneFixedShippingPrice,
  updateFixedShippingPrice,
  deleteFixedShippingPrice,
} from "../controllers/product/fixedShippingPrice.controller.js";

const router = Router();

router.route("/").post(createFixedShippingPrice).get(getAllFixedShippingPrices);
router.route("/").put(updateFixedShippingPrice);

router
  .route("/:id")
  .get(getOneFixedShippingPrice)
  .delete(deleteFixedShippingPrice);

export default router;
