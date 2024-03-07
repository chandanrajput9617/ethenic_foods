import mongoose from "mongoose";

const fixedShippingPriceSchema = new mongoose.Schema(
  {
    fixed_shipping_price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const FixedShippingPrice = mongoose.model(
  "FixedShippingPrice",
  fixedShippingPriceSchema
);
