import mongoose from "mongoose";

const dimensionWeightRangeSchema = new mongoose.Schema({
  dimensions: String,
  weight_range: String,
  length: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 0,
  },
  height: {
    type: Number,
    default: 0,
  },
});

const DimensionWeightRange = mongoose.model(
  "DimensionWeightRange",
  dimensionWeightRangeSchema
);

export default DimensionWeightRange;
