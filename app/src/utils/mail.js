import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import { ApiError } from "./ApiError.js";
import { Credential } from "../models/credentials.model.js";
import Mail from "../models/mail.model.js";

const __dirname = path.resolve();

const readImageAsDataURI = (imagePath) => {
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString("base64");
  return `data:image/png;base64,${imageBase64}`;
};

const getEmailTransport = async () => {
  try {
    let auth;
    const credentials = await Credential.findOne();

    if (credentials && credentials.sendEmail && credentials.sendEmailPassword) {
      auth = {
        user: credentials.sendEmail,
        pass: credentials.sendEmailPassword,
      };
    } else if (process.env.SEND_EMAIL && process.env.SEND_EMAIL_PASSWORD) {
      auth = {
        user: process.env.SEND_EMAIL,
        pass: process.env.SEND_EMAIL_PASSWORD,
      };
    } else {
      throw new ApiError(404, "Send email mail and password not found.");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.HOST_EMAIL,
      port: 587,
      secure: false,
      auth: auth,
    });
    return { transporter, sendEmail: credentials.sendEmail };
  } catch (error) {
    throw new ApiError(404, error.message || error);
  }
};

const sendEmail = async (recipientEmail, mailType, data) => {
  try {
    const { transporter, sendEmail } = await getEmailTransport();

    const { bannerImg, subject, body } = await Mail.findOne({
      mailType,
    }).select("bannerImg subject body");

    const emailBannerPath = path.join(__dirname, `public${bannerImg}`);
    const emailBannerDataURI = readImageAsDataURI(emailBannerPath);
    const bannerImage = bannerImg.replace(/\/emailBanner\//, "");

    const htmlBody = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; text-align: center;">
        <img src="cid:${bannerImage}" alt="Ethnic Foods Banner" style="max-width: 100%; height: auto;">
        ${body}
      </div>
    `;

    const unescapedBody = htmlBody.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    const template = handlebars.compile(unescapedBody);
    const htmlContent = template(data);

    const info = await transporter.sendMail({
      from: sendEmail,
      to: recipientEmail,
      subject: subject,
      attachments: [
        {
          filename: bannerImage,
          path: emailBannerDataURI,
          cid: bannerImage,
        },
      ],
      html: htmlContent,
    });
  } catch (error) {
    throw new ApiError(500, `${mailType} email error: ${error.message}`);
  }
};

const sendUserRegistrationConfirmationEmail = async (recipientEmail, name) => {
  const data = { name };
  await sendEmail(recipientEmail, "registration-confirmation-email", data);
};

const sendOrderConfirmationEmail = async (
  recipientEmail,
  orderId,
  orderAmount,
  items
) => {
  const data = {
    orderId,
    orderAmount,
    orderItemsList: generateOrderItemsList(items),
  };
  await sendEmail(recipientEmail, "order-confirmation-email", data);
};

const generateOrderItemsList = (items) => {
  return `
    <div style="text-align: center; margin-left: 40px;">
      <ul style="list-style-type: disc; text-align: left; padding-left: 20px; font-size: 14px;"> <!-- Adjusted font-size here -->
        ${items
          .map(
            (item) =>
              `<li>Items Number ${item?.quantity}, Item Name ${item?.title}</li>`
          )
          .join("")}
      </ul>
    </div>
  `;
};

const sendContactUsEmail = async (recipientEmail, name) => {
  const data = { name };
  await sendEmail(recipientEmail, "customer-query-email", data);
};

const sendContactUsEmailToAdmin = async (name) => {
  const { transporter, sendEmail: email } = await getEmailTransport();
  const data = { name };
  await sendEmail(email, "customer-query-admin-email", data);
};

const sendResetPasswordEmail = async (recipientEmail, name, userId, token) => {
  const data = {
    name,
    resetLink: `https://ethnicfoods.com/reset-password/${token}`,
  };
  await sendEmail(recipientEmail, "reset-password-email", data);
};

export {
  sendUserRegistrationConfirmationEmail,
  sendOrderConfirmationEmail,
  sendContactUsEmail,
  sendResetPasswordEmail,
  sendContactUsEmailToAdmin,
};
