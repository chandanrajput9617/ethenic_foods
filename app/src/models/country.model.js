import mongoose, { Schema } from "mongoose";

const countrySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Country = mongoose.model("Country", countrySchema);
