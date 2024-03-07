import { asyncHandler } from "../../utils/asyncHandler.js";
import { ViewsCustomise } from "../../models/viewsCustomise.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { viewsCustomiseValidationSchema } from "../../utils/Validation.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

//------------------create views page---------------
const createViews = asyncHandler(async (req, res) => {
  const {
    hero_section_title,
    hero_section_subtitle,
    about_us_text,
    reviews_name,
    reviews_age,
    reviews_rating,
    reviews,
    blog_content,
    blog_published,
    faq_question,
    faq_answer,
  } = req.body;

  const isExist = await ViewsCustomise.findOne();
  if (isExist) {
    return res.json(
      new ApiResponse(200, null, "You can not create  more then one document")
    );
  }

  if (!hero_section_title) {
    throw new ApiError(400, "Hero section title is required!");
  }

  if (!hero_section_subtitle) {
    throw new ApiError(400, "Hero section subtitle is required!");
  }

  if (!about_us_text) {
    throw new ApiError(400, "About us text is required!");
  }

  if (!reviews_name) {
    throw new ApiError(400, "Reviews name is required!");
  }
  if (!reviews_age) {
    throw new ApiError(400, "Reviews age is required!");
  }
  if (!reviews_name) {
    throw new ApiError(400, "Reviews name is required!");
  }
  if (!reviews_rating) {
    throw new ApiError(400, "Reviews rating is required!");
  }

  if (!reviews) {
    throw new ApiError(400, "Reviews is required!");
  }
  if (!blog_content) {
    throw new ApiError(400, "Blog content is required!");
  }

  if (!blog_published) {
    throw new ApiError(400, "Blog published is required!");
  }

  if (!faq_question) {
    throw new ApiError(400, "Faq question is required!");
  }

  if (!faq_answer) {
    throw new ApiError(400, "FAQ answer is required!");
  }

  let hero_section_image =
    (req.files["hero_section_image"] &&
      req.files["hero_section_image"][0].filename) ||
    "";

  let reviews_image =
    (req.files["reviews_image"] && req.files["reviews_image"][0].filename) ||
    "";

  let about_us_image =
    (req.files["about_us_image"] && req.files["about_us_image"][0].filename) ||
    "";

  let about_us_video =
    (req.files["about_us_video"] && req.files["about_us_video"][0].filename) ||
    "";

  let blog_image =
    (req.files["blog_image"] && req.files["blog_image"][0].filename) || "";

  let logo = (req.files["logo"] && req.files["logo"][0].filename) || "";

  let loginBackgoundImg =
    (req.files["loginBackgoundImg"] &&
      req.files["loginBackgoundImg"][0].filename) ||
    "";

  if (!hero_section_image) {
    throw new ApiError(400, "Hero section image is required!");
  }

  if (!reviews_image) {
    throw new ApiError(400, "Reviews image is required!");
  }

  if (!about_us_image) {
    throw new ApiError(400, "About us image is required!");
  }

  if (!about_us_video) {
    throw new ApiError(400, "About use video is required!");
  }

  if (!blog_image) {
    throw new ApiError(400, "Blog image is required!");
  }

  if (!logo) {
    throw new ApiError(400, "logo is required!");
  }

  if (!loginBackgoundImg) {
    throw new ApiError(400, "Login backgound img is required!");
  }

  hero_section_image = hero_section_image && `/images/${hero_section_image}`;

  about_us_video = about_us_video && `/videos/${about_us_video}`;

  about_us_image = about_us_image && `/images/${about_us_image}`;

  reviews_image = reviews_image && `/images/${reviews_image}`;

  blog_image = blog_image && `/images/${blog_image}`;
  logo = logo && `/logo/${logo}`;

  loginBackgoundImg = loginBackgoundImg && `/images/${loginBackgoundImg}`;

  const viewsObject = {
    hero_section: {
      title: hero_section_title,
      subtitle: hero_section_subtitle,
      image: hero_section_image,
    },
    about_us: {
      text: about_us_text,
      video_url: about_us_video,
      image: about_us_image,
    },
    reviews: [
      {
        name: reviews_name,
        age: reviews_age,
        image: reviews_image,
        reviews: reviews,
        rating: reviews_rating,
      },
    ],
    blog: [
      {
        image: blog_image,
        content: blog_content,
        published: blog_published,
      },
    ],
    faq: [
      {
        question: faq_question,
        answer: faq_answer,
      },
    ],
    logo: logo,
    loginBackgoundImg: loginBackgoundImg,
  };

  // const { error } = viewsCustomiseValidationSchema.validate(viewsObject);

  // if (error) {
  //   throw new ApiError(400, error.details[0].message);
  // }

  const newViewsCustomise = await ViewsCustomise.create(viewsObject);

  if (!newViewsCustomise) {
    throw new ApiError(
      500,
      "Something went wrong while creating views customise section data"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        newViewsCustomise,
        "Views customise created successfully"
      )
    );
});

//---------------------get view page------------------------
const getViews = asyncHandler(async (req, res) => {
  const getViewsCustomise = await ViewsCustomise.find();

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        getViewsCustomise,
        "Views customise data get successfully"
      )
    );
});

//---------------------update hero section------------------------
const updateHeroSection = asyncHandler(async (req, res) => {
  const { title, subtitle } = req.body;

  const hero_section_image =
    (req.files["hero_section_image"] &&
      req.files["hero_section_image"][0].filename) ||
    "";

  let heroSectionAttribute = {};

  if (title) {
    heroSectionAttribute = {
      ...heroSectionAttribute,
      "hero_section.title": title,
    };
  }

  if (subtitle) {
    heroSectionAttribute = {
      ...heroSectionAttribute,
      "hero_section.subtitle": subtitle,
    };
  }

  if (hero_section_image) {
    heroSectionAttribute = {
      ...heroSectionAttribute,
      "hero_section.image": `/images/${hero_section_image}`,
    };
  }

  const updateViewsCustomise = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $set: heroSectionAttribute,
    },
    { new: true }
  );

  if (!updateViewsCustomise) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Hero section not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateViewsCustomise,
        "Hero section updated successfully"
      )
    );
});

//---------------------create reviews section------------------------
const createReviews = asyncHandler(async (req, res) => {
  const { name, age, reviews, rating } = req.body;

  let reviews_image =
    (req.files["reviews_image"] && req.files["reviews_image"][0].filename) ||
    "";

  if (!name) {
    throw new ApiError(400, "name is required!");
  }

  if (!age) {
    throw new ApiError(400, "age is required!");
  }

  if (!reviews) {
    throw new ApiError(400, "reviews is required!");
  }

  if (!rating) {
    throw new ApiError(400, "rating is required!");
  }

  if (!reviews_image) {
    throw new ApiError(400, "Reviews image is required!");
  }

  reviews_image = reviews_image && `/images/${reviews_image}`;

  const createReview = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $push: {
        reviews: {
          name: name,
          age: age,
          reviews: reviews,
          rating: rating,
          image: reviews_image,
        },
      },
    },
    { new: true }
  );

  if (!createReview) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Reviews not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createReview, "Reviews updated successfully"));
});

//---------------------update reviews section------------------------
const updateReviews = asyncHandler(async (req, res) => {
  const { name, age, reviews, rating } = req.body;
  const { id } = req.params;

  const reviews_image =
    (req.files["reviews_image"] && req.files["reviews_image"][0].filename) ||
    "";

  if (!id) {
    throw new ApiError(400, "id is required!");
  }

  let reviewsAttribute = {};
  if (name) {
    reviewsAttribute = { ...reviewsAttribute, "reviews.$[reviews].name": name };
  }

  if (age) {
    reviewsAttribute = { ...reviewsAttribute, "reviews.$[reviews].age": age };
  }

  if (reviews) {
    reviewsAttribute = {
      ...reviewsAttribute,
      "reviews.$[reviews].reviews": reviews,
    };
  }

  if (rating) {
    reviewsAttribute = {
      ...reviewsAttribute,
      "reviews.$[reviews].rating": rating,
    };
  }

  if (reviews_image) {
    reviewsAttribute = {
      ...reviewsAttribute,
      "reviews.$[reviews].image": `/images/${reviews_image}`,
    };
  }

  const updateReviews = await ViewsCustomise.findOneAndUpdate(
    {
      "reviews._id": id,
    },
    {
      $set: reviewsAttribute,
    },
    {
      arrayFilters: [{ "reviews._id": id }],
      new: true,
    }
  );

  if (!updateReviews) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Reviews not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateReviews, "Reviews updated successfully"));
});

// ------------------------delete reviews------------------
const deleteReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid id"));
  }

  const deleteReviews = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $pull: { reviews: { _id: id } },
    },
    { new: true }
  );
  if (!deleteReviews) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Reviews  not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteReviews, "Reviews deleted successfully"));
});

//---------------------update about us section------------------------
const updateAboutUs = asyncHandler(async (req, res) => {
  const { text, about_us_video } = req.body;

  const about_us_image =
    (req.files["about_us_image"] && req.files["about_us_image"][0].filename) ||
    "";

  let aboutAttribute = {};

  if (text) {
    aboutAttribute = { ...aboutAttribute, "about_us.text": text };
  }

  if (about_us_image) {
    aboutAttribute = {
      ...aboutAttribute,
      "about_us.image": `/images/${about_us_image}`,
    };
  }

  if (about_us_video) {
    aboutAttribute = {
      ...aboutAttribute,
      "about_us.video_url": about_us_video,
    };
  }

  const updateAbout = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $set: aboutAttribute,
    },
    { new: true }
  );

  if (!updateAbout) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "About us not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateAbout, "About us updated successfully"));
});

// ------------------------create blog------------------
const createBlog = asyncHandler(async (req, res) => {
  const { content, published = false } = req.body;

  let blog_image =
    (req.files["blog_image"] && req.files["blog_image"][0].filename) || "";

  if (!content) {
    throw new ApiError(400, "content is required!");
  }

  if (!blog_image) {
    throw new ApiError(400, "Blog image is required!");
  }

  blog_image = blog_image && `/images/${blog_image}`;

  const createBlog = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $push: {
        blog: {
          content: content,
          published: published,
          image: blog_image,
        },
      },
    },
    { new: true }
  );

  if (!createBlog) {
    return res.status(404).json(new ApiResponse(404, null, "blog not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createBlog, "blog create successfully"));
});

//---------------------update blog section------------------------
const updateBlog = asyncHandler(async (req, res) => {
  const { content, published = false } = req.body;
  const { id } = req.params;

  const blog_image =
    (req.files["blog_image"] && req.files["blog_image"][0].filename) || "";

  if (!id) {
    throw new ApiError(400, "id is required!");
  }
  let blogAttribute = {};

  if (content) {
    blogAttribute = { ...blogAttribute, "blog.$[blog].content": content };
  }

  if (published) {
    blogAttribute = { ...blogAttribute, "blog.$[blog].published": published };
  }

  if (blog_image) {
    blogAttribute = {
      ...blogAttribute,
      "blog.$[blog].image": `/images/${blog_image}`,
    };
  }

  const updateBlog = await ViewsCustomise.findOneAndUpdate(
    {
      "blog._id": id,
    },
    {
      $set: blogAttribute,
    },
    {
      arrayFilters: [{ "blog._id": id }],
      new: true,
    }
  );

  if (!updateBlog) {
    return res.status(404).json(new ApiResponse(404, null, "blog not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateBlog, "blog updated successfully"));
});

// ------------------------delete blog------------------
const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid id"));
  }

  const deleteBlog = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $pull: { blog: { _id: id } },
    },
    { new: true }
  );

  if (!deleteBlog) {
    return res.status(404).json(new ApiResponse(404, null, "blog not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteBlog, "blog deleted successfully"));
});

//---------------------create FAQ section------------------------
const createFAQ = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;

  if (!question) {
    throw new ApiError(400, "Question is required!");
  }

  if (!answer) {
    throw new ApiError(400, "Answer is required!");
  }

  const createFAQ = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $push: {
        faq: {
          question: question,
          answer: answer,
        },
      },
    },
    { new: true }
  );

  if (!createFAQ) {
    return res.status(404).json(new ApiResponse(404, null, "faq not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createFAQ, "faq updated successfully"));
});

//---------------------update FAQ section------------------------
const updateFAQ = asyncHandler(async (req, res) => {
  const { question, answer } = req.body;

  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "id is required!");
  }

  let faqAttribute = {};

  if (question) {
    faqAttribute = { ...faqAttribute, "faq.$[faq].question": question };
  }

  if (answer) {
    faqAttribute = { ...faqAttribute, "faq.$[faq].answer": answer };
  }

  const updateFAQ = await ViewsCustomise.findOneAndUpdate(
    {
      "faq._id": id,
    },
    {
      $set: faqAttribute,
    },
    {
      arrayFilters: [{ "faq._id": id }],
      new: true,
    }
  );

  if (!updateFAQ) {
    return res.status(404).json(new ApiResponse(404, null, "faq not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateFAQ, "faq updated successfully"));
});

// ------------------------delete blog------------------
const deleteFAQ = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid id"));
  }

  const deleteFAQ = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $pull: { faq: { _id: id } },
    },
    { new: true }
  );

  if (!deleteFAQ) {
    return res.status(404).json(new ApiResponse(404, null, "FAQ not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteFAQ, "FAQ deleted successfully"));
});

//---------------------update logo section------------------------
const updateLogo = asyncHandler(async (req, res) => {
  const logo = (req.files["logo"] && req.files["logo"][0].filename) || "";
  let logoImage = {};
  if (logo) {
    logoImage = { ...logoImage, logo: `/logo/${logo}` };
  }

  const updateLogo = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $set: logoImage,
    },
    { new: true }
  );

  if (!updateLogo) {
    return res.status(404).json(new ApiResponse(404, null, "logo not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateLogo, "logo updated successfully"));
});

//---------------------update login background image section------------------------

const updateLoginBackgroundImg = asyncHandler(async (req, res) => {
  const loginBackgoundImg =
    (req.files["loginBackgoundImg"] &&
      req.files["loginBackgoundImg"][0].filename) ||
    "";
  let loginBackgoundImage = {};
  if (loginBackgoundImg) {
    loginBackgoundImage = {
      ...loginBackgoundImage,
      loginBackgoundImg: `/images/${loginBackgoundImg}`,
    };
  }

  const updateloginBackgoundImg = await ViewsCustomise.findOneAndUpdate(
    {},
    {
      $set: loginBackgoundImage,
    },
    { new: true }
  );

  if (!updateloginBackgoundImg) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "loginBackgoundImg not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateloginBackgoundImg,
        "loginBackgoundImg updated successfully"
      )
    );
});

export {
  createViews,
  getViews,
  updateHeroSection,
  updateReviews,
  updateAboutUs,
  updateBlog,
  updateFAQ,
  updateLogo,
  createBlog,
  createFAQ,
  createReviews,
  deleteBlog,
  deleteFAQ,
  deleteReviews,
  updateLoginBackgroundImg,
};
