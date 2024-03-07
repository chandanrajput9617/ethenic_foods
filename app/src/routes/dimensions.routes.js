import { Router } from "express";

import { uploadCSVFile } from "../middlewares/uploadCSVFile.js";
import {
  createDimension,
  createDimensionWeightRange,
  deleteDimension,
  deleteDimensionWeightRange,
  dimensionCsvFileUpload,
  dimensionWeightRangeCsvFileUpload,
  getDimension,
  getDimensionWeightRange,
  updateDimension,
  updateDimensionWeightRange,
} from "../controllers/product/dimensions.controller.js";
const router = Router();

router
  .route("/csv-file-upload")
  .post(uploadCSVFile.single("csvFile"), dimensionCsvFileUpload);

router
  .route("/csv-file-upload/dimension-weight-range")
  .post(uploadCSVFile.single("csvFile"), dimensionWeightRangeCsvFileUpload);

router.route("/get-product-dimension").get(getDimension);

router.route("/create-product-dimension").post(createDimension);

router.route("/:id").put(updateDimension).delete(deleteDimension);

router
  .route("/get-product-weight-range-dimension")
  .get(getDimensionWeightRange);

router
  .route("/create-product-weight-range-dimension")
  .post(createDimensionWeightRange);

router
  .route("/weight-range/:id")
  .put(updateDimensionWeightRange)
  .delete(deleteDimensionWeightRange);

export default router;
