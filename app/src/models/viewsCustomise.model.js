import mongoose, { Schema } from "mongoose";

let reviewsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    reviews: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let blogSchema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const viewsCustomiseSchema = new Schema(
  {
    hero_section: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },

    about_us: {
      text: {
        type: String,
        required: true,
      },
      video_url: {
        type: String,
      },

      image: {
        type: String,
        required: true,
      },
    },

    reviews: [reviewsSchema],

    blog: [blogSchema],

    faq: [faqSchema],

    logo: {
      type: String,
      required: true,
    },
    loginBackgoundImg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ViewsCustomise = mongoose.model(
  "ViewsCustomise",
  viewsCustomiseSchema
);
