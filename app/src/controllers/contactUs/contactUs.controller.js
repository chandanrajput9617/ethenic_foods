import ContactUs from "../../models/contactUs.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import {
  sendContactUsEmail,
  sendContactUsEmailToAdmin,
} from "../../utils/mail.js";

// Create a new contact
export const createContactUs = asyncHandler(async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      throw new ApiError(400, "All fields are required!");
    }

    const newContact = new ContactUs({
      name,
      email,
      subject,
      message,
    });

    const savedContact = await newContact.save();

    if (!savedContact) {
      throw new ApiError(
        400,
        "Something went wrong while creating contact us."
      );
    }

    await sendContactUsEmail(email, name);

    await sendContactUsEmailToAdmin(name);
    res
      .status(201)
      .json(
        new ApiResponse(201, savedContact, "Contact us created successfully.")
      );
  } catch (error) {
    console.error("Error creating contact:", error);
    throw new ApiError(500, error);
  }
});

// Get all contacts
export const getContactsUs = asyncHandler(async (req, res) => {
  try {
    const contacts = await ContactUs.find().sort({ createdAt: -1 });

    res.status(200).json(new ApiResponse(200, { success: true, contacts }));
  } catch (error) {
    console.error("Error getting contacts:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});

export const deleteContactsUs = asyncHandler(async (req, res) => {
  try {
    const contacts = await ContactUs.findByIdAndDelete(req.params?.id);

    res.status(200).json(new ApiResponse(200, { success: true, contacts }));
  } catch (error) {
    console.error("Error Deleting contacts:", error);
    throw new ApiError(500, "Internal Server Error");
  }
});
