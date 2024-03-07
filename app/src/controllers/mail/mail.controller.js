import Mail from "../../models/mail.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const createMail = async (req, res) => {
  try {
    let { mailType, subject, body } = req.body;
    mailType = mailType && mailType?.toLowerCase();

    const existingMail = await Mail.findOne({ mailType });
    if (existingMail) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            null,
            `A ${mailType} mail content document already exists.`
          )
        );
    }

    console.log("bannerImg--", req.file);

    let bannerImg = "";
    if (req.file && req.file.filename) {
      bannerImg = `/emailBanner/${req?.file?.filename}`;
    }

    console.log("bannerImg", bannerImg);

    if (!bannerImg) {
      throw new Error("Banner image is required.");
    }

    if (!subject) {
      throw new Error("Subject image is required.");
    }

    if (!body) {
      throw new Error("Body image is required.");
    }

    const newMail = new Mail({
      mailType,
      bannerImg,
      subject,
      body,
    });

    const savedMail = await newMail.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, savedMail, "Mail content created successfully.")
      );
  } catch (error) {
    console.error("Error creating mail content:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error creating mail content."));
  }
};

export const getMail = async (req, res) => {
  try {
    let { mailType } = req.query;

    mailType = mailType && mailType?.toLowerCase();

    const existingMail = await Mail.find().select(
      "bannerImg mailType subject body"
    );

    if (!existingMail) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Mail contents not found."));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, existingMail, "Mail content get successfully.")
      );
  } catch (error) {
    console.error("Error get mail:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error get mail content."));
  }
};

export const updateMail = async (req, res) => {
  try {
    let { mailType, subject, body } = req.body;

    mailType = mailType && mailType?.toLowerCase();

    const existingMail = await Mail.findOne({ mailType });
    if (!existingMail) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "Mail content not found."));
    }

    if (req.file && req.file.filename) {
      existingMail.bannerImg = `/emailBanner/${req?.file?.filename}`;
    }
    if (subject) {
      existingMail.subject = subject;
    }
    if (body) {
      existingMail.body = body;
    }

    const updatedMail = await existingMail.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedMail, "Mail content updated successfully.")
      );
  } catch (error) {
    console.error("Error updating mail:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error updating mail content."));
  }
};
