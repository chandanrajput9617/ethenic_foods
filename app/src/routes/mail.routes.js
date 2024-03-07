import { Router } from "express";
import { uploadEmailBanner } from "../middlewares/uploadMailBannerImg.js";
import {
  createMail,
  updateMail,
  getMail,
} from "../controllers/mail/mail.controller.js";
const router = Router();

router
  .route("/")
  .get(getMail)
  .post(uploadEmailBanner.single("bannerImg"), createMail)
  .put(uploadEmailBanner.single("bannerImg"), updateMail);

export default router;
