import mongoose from "mongoose";
const credentialSchema = new mongoose.Schema(
  {
    stripePublishableKey: {
      type: String,
      required: true,
    },
    stripeSecretKey: {
      type: String,
      required: true,
    },
    stripeEndpointSecret: {
      type: String,
      required: true,
    },
    sendEmail: {
      type: String,
      required: true,
    },
    sendEmailPassword: {
      type: String,
      required: true,
    },
    hostEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Credential = mongoose.model("Credential", credentialSchema);
