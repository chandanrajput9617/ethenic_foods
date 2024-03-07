import { Router } from "express";
import {
  createProductData,
  createCategory,
  getProductData,
  deleteProductData,
  updateProductData,
  addItemToCart,
  getCart,
  emptyCart,
  getAllCategory,
  createCountry,
  getAllCountry,
  getBestSeller,
  getProductById,
  removeItemsFromCart,
  createProductReview,
  getProductList,
  productSearch,
  getProductZipFile,
} from "../controllers/product/product.controller.js";
import { upload } from "../middlewares/uploadMediaFile.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { userAuth } from "../middlewares/userAuth.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/get-best-seller-product").get(getBestSeller);

router.route("/get-product").get(getProductData);
router.route("/get-single-product/:id").get(getProductById);

router.route("/create-product").post(async (req, res, next) => {
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
    { name: "zipFile", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(201).json(new ApiResponse(500, null, err.message));
    } else {
      next();
    }
  });
}, createProductData);

router.route("/update-product/:id").put(async (req, res, next) => {
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
    { name: "zipFile", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) {
      return res.status(201).json(new ApiResponse(500, null, err.message));
    } else {
      next();
    }
  });
}, updateProductData);

router.route("/delete-product/:id").delete(deleteProductData);

router.route("/create-category").post(createCategory);
router.route("/create-product-review/:id").post(userAuth, createProductReview);

router.route("/get-all-category").get(getAllCategory);

router.route("/add-to-cart").post(userAuth, addItemToCart);

router.route("/get-cart").get(userAuth, getCart);

router.route("/remove-all-items-from-cart").get(userAuth, emptyCart);
router.route("/remove-items-from-cart/:id").get(userAuth, removeItemsFromCart);

router.route("/create-country").post(createCountry);

router.route("/get-all-country").get(getAllCountry);

router.route("/get-product-list").get(getProductList);

router.route("/search").post(productSearch);
router.route("/get-product-zifile/:id").get(getProductZipFile);

export default router;
