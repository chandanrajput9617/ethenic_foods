import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    origin_country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    rotate360lip: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    video_url: {
      type: String,
    },
    expiry_date: {
      type: Date,
      required: true,
    },
    promotion_code: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
    best_seller: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    zipFile: {
      type: Object,
    },
    weight: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
    youtube_video_url: {
      type: String,
      default: null,
    },
    zipFile: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model("Product", productSchema);
