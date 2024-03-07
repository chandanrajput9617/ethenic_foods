import { FixedShippingPrice } from "../../models/fixedShippingPrice.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// Create
export const createFixedShippingPrice = async (req, res) => {
  try {
    const { fixed_shipping_price } = req.body;
    const isFixedShippingPriceExist = await FixedShippingPrice.findOne({
      fixed_shipping_price,
    });
    if (isFixedShippingPriceExist) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            isFixedShippingPriceExist,
            "Fixed shipping price already exists."
          )
        );
    }

    const newFixedShippingPrice = new FixedShippingPrice({
      fixed_shipping_price,
    });
    const savedFixedShippingPrice = await newFixedShippingPrice.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          savedFixedShippingPrice,
          "Fixed shipping price created successfully."
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(400, error.message || error.Error));
  }
};

// Read all
export const getAllFixedShippingPrices = async (req, res) => {
  try {
    const FixedShippingPrices = await FixedShippingPrice.find();
    return res.json(new ApiResponse(200, FixedShippingPrices, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Read one
export const getOneFixedShippingPrice = async (req, res) => {
  try {
    const FixedShippingPrice = await FixedShippingPrice.findById(req.params.id);
    if (!FixedShippingPrice) {
      return res
        .status(404)
        .json(new ApiError(404, "Fixed shipping price not found"));
    }
    res.json(new ApiResponse(200, FixedShippingPrice, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Update
export const updateFixedShippingPrice = async (req, res) => {
  try {
    const { fixed_shipping_price } = req.body;
    const updatedFixedShippingPrice = await FixedShippingPrice.findOneAndUpdate(
      {},
      { fixed_shipping_price },
      { new: true }
    );
    if (!updatedFixedShippingPrice) {
      return res
        .status(404)
        .json(new ApiError(404, "Fixed shipping price not found"));
    }
    res.json(new ApiResponse(200, updatedFixedShippingPrice, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Delete
export const deleteFixedShippingPrice = async (req, res) => {
  try {
    const deletedFixedShippingPrice =
      await FixedShippingPrice.findByIdAndDelete(req.params.id);
    if (!deletedFixedShippingPrice) {
      return res
        .status(404)
        .json(new ApiError(404, "Fixed shipping price not found"));
    }
    return res.json(
      new ApiResponse(
        200,
        { message: "Success" },
        "Fixed shipping price deleted successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};
