import Joi from "joi";

const userRegistrationValidation = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .required(),
  confirmPassword: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().required(),
  zipcode: Joi.string().required(),
});

const productValidation = Joi.object({
  title: Joi.string().required(),
  short_description: Joi.string().required(),
  description: Joi.string().required(),
  origin_country: Joi.string().required(),
  price: Joi.number().required(),
  expiry_date: Joi.date().required(),
  promotion_code: Joi.string().required(),
  rank: Joi.number().required(),
  category: Joi.string().required(),
  weight: Joi.number().required(),
});

// views customization validation
const heroSectionSchema = Joi.object({
  title: Joi.string().required(),
  subtitle: Joi.string().required(),
  image: Joi.string().required(),
});

const aboutUsSchema = Joi.object({
  text: Joi.string().required(),
  video: Joi.string(),
  image: Joi.string().required(),
});

const reviewsSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  reviews: Joi.string().required(),
  rating: Joi.string().required(),
});

const blogSchema = Joi.object({
  image: Joi.string().required(),
  content: Joi.string().required(),
  published: Joi.boolean().required(),
});

const faqSchema = Joi.object({
  question: Joi.string().required(),
  answer: Joi.string().required(),
});

const logoSchema = Joi.string().required();

const viewsCustomiseValidationSchema = Joi.object({
  hero_section: heroSectionSchema.required(),
  about_us: aboutUsSchema.required(),
  reviews: reviewsSchema.required(),
  blog: blogSchema.required(),
  faq: faqSchema.required(),
  logo: logoSchema,
});

export {
  userRegistrationValidation,
  productValidation,
  viewsCustomiseValidationSchema,
};
