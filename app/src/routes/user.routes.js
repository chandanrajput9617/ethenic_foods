import { Router } from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  logoutUser,
  userOrderHistory,
  forgotPassword,
  resetPassword,
  getResetPassword,
} from "../controllers/user/user.controller.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = Router();

router.route("/get-current").get(userAuth, getCurrentUser);
router.route("/get-users").get(getAllUsers);
router.route("/register").post(registerUser);
router.route("/update-user/:id").put(userAuth, updateUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.route("/get-user-order-history").get(userAuth, userOrderHistory);

export default router;
