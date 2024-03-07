import mongoose from "mongoose";

const freeZipCodeSchema = new mongoose.Schema(
  {
    zipCode: {
      type: String,
      required: true,
      unique: true,
    },
    shipment_delivery_message: {
      type: String,
      required: true,
    },
    stateCode: String,
    stateName: String,
    city: String,
    county: String,
    countyAll: String,
    timeZone: String,
    latitude: String,
    longitude: String,
  },
  {
    timestamps: true,
  }
);

export const FreeZipCode = mongoose.model("FreeZipCode", freeZipCodeSchema);
