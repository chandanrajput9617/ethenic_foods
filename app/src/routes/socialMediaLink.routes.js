import { Router } from "express";
import {
  createSocialMediaLink,
  getSocialMediaLinks,
  updateSocialMediaLink,
} from "../controllers/socailMediaLink/socailMediaLink.controller.js";

const router = Router();

router
  .route("/")
  .post(createSocialMediaLink)
  .get(getSocialMediaLinks)
  .put(updateSocialMediaLink);

export default router;
