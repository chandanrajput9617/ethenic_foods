import mongoose from "mongoose";

const shipmentRateStateSchema = new mongoose.Schema({
  state: String,
  postal: String,
  state_code: String,
  shipment_state_rate: Number,
  shipment_delivery_message: String,
});

const ShipmentRateState = mongoose.model(
  "ShipmentRateState",
  shipmentRateStateSchema
);

export default ShipmentRateState;
