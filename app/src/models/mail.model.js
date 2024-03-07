import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    mailType: {
      type: String,
      required: true,
    },
    bannerImg: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mail = mongoose.model("Mail", mailSchema);

export default Mail;
