import { Router } from "express";
import {
  TaxCsvFileUpload,
  createTax,
  deleteTax,
  getTax,
  updateTax,
} from "../controllers/product/tax.controller.js";

import { uploadCSVFile } from "../middlewares/uploadCSVFile.js";
const router = Router();

router
  .route("/csv-file-upload")
  .post(uploadCSVFile.single("csvFile"), TaxCsvFileUpload);

router.route("/").post(createTax).get(getTax);
router.route("/:id").put(updateTax).delete(deleteTax);

export default router;
