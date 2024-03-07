import mongoose from "mongoose";

const socialMediaLinkSchema = new mongoose.Schema(
  {
    facebook: {
      link: {
        type: String,
        required: true,
      },
    },
    twitter: {
      link: {
        type: String,
        required: true,
      },
    },
    instagram: {
      link: {
        type: String,
        required: true,
      },
    },
    linkedin: {
      link: {
        type: String,
        required: true,
      },
    },
    youtube: {
      link: {
        type: String,
        required: true,
      },
    },
    pinterest: {
      link: {
        type: String,
        required: true,
      },
    },
    snapchat: {
      link: {
        type: String,
        required: true,
      },
    },
    tiktok: {
      link: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Create the model
export const SocialMediaLink = mongoose.model(
  "SocialMediaLink",
  socialMediaLinkSchema
);
