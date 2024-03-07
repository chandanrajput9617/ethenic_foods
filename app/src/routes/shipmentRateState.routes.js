import { Router } from "express";

import { uploadCSVFile } from "../middlewares/uploadCSVFile.js";
import {
  shipmentRateStateCsvFileUpload,
  getShipmentRateState,
  updateShipmentRateState,
  deleteShipmentRateState,
  createShipmentRateState,
} from "../controllers/product/shipmentRateState.controller.js";
const router = Router();

router
  .route("/csv-file-upload")
  .post(uploadCSVFile.single("csvFile"), shipmentRateStateCsvFileUpload);

router.route("/get-shipment-rate-state").get(getShipmentRateState);
router.route("/").post(createShipmentRateState);
router
  .route("/:id")
  .put(updateShipmentRateState)
  .delete(deleteShipmentRateState);

export default router;
