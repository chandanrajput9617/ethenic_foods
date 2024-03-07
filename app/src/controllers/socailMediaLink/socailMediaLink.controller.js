import { SocialMediaLink } from "../../models/socialMediaLink.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
// Create method
const createSocialMediaLink = async (req, res) => {
  try {
    const isExist = await SocialMediaLink.findOne();
    if (isExist) {
      return res.json(
        new ApiResponse(200, null, "You can not create  more then one document")
      );
    }
    const newSocialMediaLink = new SocialMediaLink(req.body);
    const savedLink = await newSocialMediaLink.save();
    return res.json(
      new ApiResponse(
        201,
        savedLink,
        "Social media links created successfully."
      )
    );
  } catch (error) {
    console.error("Error creating social media links:", error);
    res.json(new ApiResponse(500, null, "Error creating social media links."));
  }
};

// Get method
const getSocialMediaLinks = async (req, res) => {
  try {
    const socialMediaLinks = await SocialMediaLink.findOne();
    return res.json(new ApiResponse(201, socialMediaLinks, "Success"));
  } catch (error) {
    res.json(new ApiResponse(500, null, "false"));
  }
};

// Update method
const updateSocialMediaLink = async (req, res) => {
  try {
    const updatedLinks = {};

    for (const [platform, { link: newLink }] of Object.entries(req.body)) {
      if (!newLink) {
        return res.json(
          new ApiResponse(
            400,
            null,
            `New link is required for the update of ${platform}.`
          )
        );
      }

      const updatedLink = await SocialMediaLink.findOneAndUpdate(
        { [platform]: { $exists: true } },
        { [platform]: { link: newLink } },
        { new: true }
      );

      if (updatedLink) {
        updatedLinks[platform] = updatedLink[platform];
      }
    }

    if (Object.keys(updatedLinks).length > 0) {
      return res.json(
        new ApiResponse(
          200,
          updatedLinks,
          "Social media links updated successfully."
        )
      );
    } else {
      return res.json(
        new ApiResponse(400, null, "No social media links updated.")
      );
    }
  } catch (error) {
    console.error("Error updating social media links:", error);
    res.json(
      new ApiResponse(
        500,
        null,
        `Error updating social media links: ${error.message}`
      )
    );
  }
};

export { createSocialMediaLink, getSocialMediaLinks, updateSocialMediaLink };
