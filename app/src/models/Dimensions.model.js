import mongoose from "mongoose";

const dimensionSchema = new mongoose.Schema({
  dimensions: String,
  length: Number,
  width: Number,
  height: Number,
  shipment_dimension_price: Number,
});

const Dimension = mongoose.model("Dimension", dimensionSchema);

export default Dimension;
