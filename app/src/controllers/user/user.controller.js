import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userRegistrationValidation } from "../../utils/Validation.js";
import {
  sendResetPasswordEmail,
  sendUserRegistrationConfirmationEmail,
} from "../../utils/mail.js";
import { OrderHistory } from "../../models/orderHistory.model.js";

//get all user

const getAllUsers = asyncHandler(async (req, res) => {
  const { username, email } = req.query;

  const filter = {};

  if (username) filter.username = username;
  if (email) filter.email = email;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const options = { page };

  // const usersData = await User.paginate(filter, options);
  const usersData = await User.find();

  return res
    .status(200)
    .json(new ApiResponse(200, usersData, "Get all users data successfully"));
});

//get single user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Get current user data successfully"));
});

//User register part-
const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    confirmPassword,
    address,
    city,
    state,
    country,
    zipcode,
  } = req.body.userData;

  const { error } = userRegistrationValidation.validate(req.body.userData);

  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirmation password do not match");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    address,
    city,
    state,
    country,
    zipcode,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  } else {
    try {
      if (createdUser && createdUser.email) {
        const name = createdUser.username || createdUser.email.split("@")[0];

        await sendUserRegistrationConfirmationEmail(createdUser.email, name);
      }
    } catch (error) {
      throw new ApiError(500, "Error sending email to the registered user");
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

//update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, email, address, city, state, country, zipcode } =
    req.body.userData;

  const existingUser = await User.findById(id);

  if (!existingUser) {
    throw new ApiError(404, "User Not Found");
  }

  existingUser.username = username || existingUser.username;
  existingUser.email = email || existingUser.email;
  existingUser.address = address || existingUser.address;
  existingUser.city = city || existingUser.city;
  existingUser.state = state || existingUser.state;
  existingUser.country = country || existingUser.country;
  existingUser.zipcode = zipcode || existingUser.zipcode;

  const updatedUser = await existingUser.save();

  if (!updatedUser) {
    throw new ApiError(500, "Error updating user information");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// User login part-
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body.userData;
  if (!email) {
    throw new ApiError(400, "Email and password fields are required!");
  }

  if (!password) {
    throw new ApiError(400, "Email and password fields are required!");
  }

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new ApiError(404, "User Not Found!");
  } else if (await bcrypt.compare(password, existedUser.password)) {
    const tokenPayload = {
      _id: existedUser._id,
      email: existedUser.email,
      role: existedUser.role,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET);

    res.status(201).json(new ApiResponse(200, accessToken, "User Logged In!"));
  } else {
    throw new ApiError(400, "Email and password fields are incorrect!");
  }
});

// User logout part-
const logoutUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, "User Logout!"));
});

// get user order history
const userOrderHistory = asyncHandler(async (req, res) => {
  const getUserOrderHistoryData = await OrderHistory.aggregate([
    {
      $match: { userId: req.user._id },
    },
    {
      $lookup: {
        from: "orders",
        localField: "orderId",
        foreignField: "_id",
        as: "orderDetails",
      },
    },
    {
      $unwind: "$orderDetails",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderDetails.products",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    {
      $unwind: "$userData",
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, getUserOrderHistoryData, "User Logout!"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required!");
  }

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    return res.status(200).json(new ApiResponse(404, null, "User not exist!"));
  }

  const tokenPayload = {
    _id: isUserExist?._id,
    email: isUserExist?.email,
    role: isUserExist?.role,
  };

  const expiresIn = 600;

  const accessToken = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });

  await sendResetPasswordEmail(
    isUserExist?.email,
    isUserExist?.username,
    isUserExist?._id,
    accessToken
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        accessToken,
        "Email send successully for reset password."
      )
    );
});

const getResetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  if (!token) {
    throw new ApiError(400, "Token not found.");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, token, "Password reset successfully."));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword, token } = req.body;
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New password and confirm password do not match.");
  }

  let isValidToken;

  try {
    isValidToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!isValidToken) {
      throw new ApiError(400, "Invalid or expired token.");
    }
  } catch (error) {
    throw new ApiError(400, "Invalid or expired token.");
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);

  const data = await User.findByIdAndUpdate(isValidToken?._id, {
    password: hashPassword,
  }).select("-password");
  if (!data) {
    throw new ApiError(400, "Something went wrong while reset password.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Password reset successfully."));
});

export {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUser,
  updateUser,
  logoutUser,
  userOrderHistory,
  forgotPassword,
  resetPassword,
  getResetPassword,
};
