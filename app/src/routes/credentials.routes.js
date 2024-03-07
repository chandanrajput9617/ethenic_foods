import { Router } from "express";
import {
  createCredential,
  getAllCredentials,
  updateCredential,
} from "../controllers/user/credentials.controller.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = Router();

router
  .route("/")
  .post(adminAuth, createCredential)
  .get(getAllCredentials)
  .put(adminAuth, updateCredential);

export default router;
