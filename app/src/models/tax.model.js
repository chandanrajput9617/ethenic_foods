import mongoose from "mongoose";

const TaxSchema = new mongoose.Schema({
  state_code: String,
  state_tax_rate: String,
});

const Tax = mongoose.model("Tax", TaxSchema);

export default Tax;
