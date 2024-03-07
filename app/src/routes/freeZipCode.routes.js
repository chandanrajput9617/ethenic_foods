import { Router } from "express";
import {
  createFreeZipCode,
  getAllFreeZipCodes,
  getOneFreeZipCode,
  updateFreeZipCode,
  deleteFreeZipCode,
  freeZipCodeCsvFileUpload,
} from "../controllers/product/freeZipCode.controller.js";
import { uploadCSVFile } from "../middlewares/uploadCSVFile.js";
const router = Router();

router.route("/").post(createFreeZipCode).get(getAllFreeZipCodes);
router
  .route("/csv-file-upload")
  .post(uploadCSVFile.single("csvFile"), freeZipCodeCsvFileUpload);

router
  .route("/:id")
  .get(getOneFreeZipCode)
  .put(updateFreeZipCode)
  .delete(deleteFreeZipCode);

export default router;
