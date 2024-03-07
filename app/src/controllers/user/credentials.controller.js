import { Credential } from "../../models/credentials.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const createCredential = async (req, res) => {
  try {
    const isExist = await Credential.findOne();
    if (isExist) {
      return res.json(
        new ApiResponse(200, null, "You can not create  more then one document")
      );
    }
    const newCredential = new Credential(req.body);
    const savedCredential = await newCredential.save();

    return res.json(
      new ApiResponse(201, savedCredential, "Credential created successfully.")
    );
  } catch (error) {
    console.error("Error creating credential:", error);
    return res.json(
      new ApiResponse(500, null, "Error creating credential.", false)
    );
  }
};

// Update an existing credential
const updateCredential = async (req, res) => {
  try {
    const update = { $set: req.body };
    const options = { new: true };

    const updatedCredential = await Credential.findOneAndUpdate(
      {},
      update,
      options
    );

    if (updatedCredential) {
      return res.json(
        new ApiResponse(
          200,
          updatedCredential,
          "Credential updated successfully."
        )
      );
    } else {
      return res.json(
        new ApiResponse(
          404,
          null,
          `Credential not found based on stripePublishableKey: ${stripePublishableKey}.`
        )
      );
    }
  } catch (error) {
    console.error("Error updating credential:", error);
    return res.json(new ApiResponse(500, null, "Error updating credential."));
  }
};

// Get all credentials
const getAllCredentials = async (req, res) => {
  try {
    const credentials = await Credential.findOne().select(
      "stripePublishableKey stripeSecretKey stripeEndpointSecret sendEmail sendEmailPassword hostEmail"
    );

    return res.json(
      new ApiResponse(200, credentials, "Credentials retrieved successfully.")
    );
  } catch (error) {
    console.error("Error getting credentials:", error);
    return res.json(new ApiResponse(500, null, "Error getting credentials."));
  }
};

export { createCredential, updateCredential, getAllCredentials };
