import { ApiError } from "./ApiError.js";

const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await Promise.resolve(requestHandler(req, res, next));
    } catch (error) {
      if (error instanceof ApiError) {
        const jsonResponse = error.toJSON();
        res.status(jsonResponse.statusCode).json(jsonResponse);
      } else {
        next(error);
      }
    }
  };
};

export { asyncHandler };
