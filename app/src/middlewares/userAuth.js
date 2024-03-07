import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const userAuth = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer", "").trim();
    if (!token) {
      throw new ApiError(401, "Token not found");
    }

    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const existedUser = await User.findOne({ email: user.email }).select(
      "-password"
    );

    if (!existedUser) {
      throw new ApiError(404, "User Not Found");
    }

    if (existedUser.role == "admin") {
      req.user = existedUser;
      return next();
    }

    if (existedUser.role !== "user") {
      throw new ApiError(401, "Not permissions");
    }

    req.user = existedUser;
    return next();
  } catch (error) {
    res.status(error.statusCode || 500).json(error?.message);
  }
};

export { userAuth };
