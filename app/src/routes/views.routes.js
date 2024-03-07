import { Router } from "express";
import {
  createViews,
  getViews,
  updateAboutUs,
  updateBlog,
  updateFAQ,
  updateHeroSection,
  updateLogo,
  updateReviews,
  createBlog,
  createReviews,
  createFAQ,
  deleteReviews,
  deleteBlog,
  deleteFAQ,
  updateLoginBackgroundImg,
} from "../controllers/viewsCustomization/views.controller.js";
import { upload } from "../middlewares/uploadMediaFile.js";

const router = Router();

router.route("/create-views").post(
  upload.fields([
    { name: "hero_section_image", maxCount: 1 },
    { name: "reviews_image", maxCount: 1 },
    { name: "about_us_image", maxCount: 1 },
    { name: "blog_image", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "loginBackgoundImg", maxCount: 1 },
    { name: "about_us_video", maxCount: 1 },
  ]),
  createViews
);

router.route("/get-views").get(getViews);

router
  .route("/update-hero-section-views")
  .put(
    upload.fields([{ name: "hero_section_image", maxCount: 1 }]),
    updateHeroSection
  );

router
  .route("/create-reviews-views")
  .post(upload.fields([{ name: "reviews_image", maxCount: 1 }]), createReviews);

router
  .route("/update-reviews-views/:id")
  .put(upload.fields([{ name: "reviews_image", maxCount: 1 }]), updateReviews);

router.route("/delete-reviews-views/:id").delete(deleteReviews);

router
  .route("/update-about-us")
  .put(upload.fields([{ name: "about_us_image", maxCount: 1 }]), updateAboutUs);

router
  .route("/create-blog-views")
  .post(upload.fields([{ name: "blog_image", maxCount: 1 }]), createBlog);

router
  .route("/update-blog-views/:id")
  .put(upload.fields([{ name: "blog_image", maxCount: 1 }]), updateBlog);

router.route("/delete-blog-views/:id").delete(deleteBlog);

router.route("/create-faq-views").post(createFAQ);

router.route("/update-faq-views/:id").put(updateFAQ);

router.route("/delete-faq-views/:id").delete(deleteFAQ);

router
  .route("/update-logo-views")
  .put(upload.fields([{ name: "logo", maxCount: 1 }]), updateLogo);

router
  .route("/update-login-background-image")
  .put(
    upload.fields([{ name: "loginBackgoundImg", maxCount: 1 }]),
    updateLoginBackgroundImg
  );

export default router;
