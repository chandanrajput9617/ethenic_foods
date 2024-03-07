import { Router } from "express";
import {
  createContactUs,
  deleteContactsUs,
  getContactsUs,
} from "../controllers/contactUs/contactUs.controller.js";

const router = Router();

router.route("/").post(createContactUs).get(getContactsUs);
router.route("/:id").delete(deleteContactsUs);

export default router;
