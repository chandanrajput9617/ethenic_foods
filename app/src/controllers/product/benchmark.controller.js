import { Benchmark } from "../../models/benchmark.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

// Create
export const createBenchmark = async (req, res) => {
  try {
    const { benchmark1, benchmark2 } = req.body;
    const newBenchmark = new Benchmark({ benchmark1, benchmark2 });
    const savedBenchmark = await newBenchmark.save();
    return res.json(
      new ApiResponse(200, savedBenchmark, "Benchmark created successfully")
    );
  } catch (error) {
    return res.status(400).json(new ApiError(400, error.message));
  }
};

// Read all
export const getAllBenchmarks = async (req, res) => {
  try {
    const benchmarks = await Benchmark.find();
    return res.json(new ApiResponse(200, benchmarks, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Read one
export const getOneBenchmark = async (req, res) => {
  try {
    const benchmark = await Benchmark.findById(req.params.id);
    if (!benchmark) {
      return res.status(404).json(new ApiError(404, "Benchmark not found"));
    }
    return res.json(new ApiResponse(200, benchmark, "Success"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Update
export const updateBenchmark = async (req, res) => {
  try {
    const { benchmark1, benchmark2 } = req.body;

    const updatedBenchmark = await Benchmark.findOneAndUpdate(
      {},
      { $set: { benchmark1, benchmark2 } },
      { new: true }
    );

    if (!updatedBenchmark) {
      return res.status(404).json(new ApiError(404, "Benchmark not found"));
    }

    return res.json(
      new ApiResponse(200, updatedBenchmark, "Benchmark updated successfully")
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};

// Delete
export const deleteBenchmark = async (req, res) => {
  try {
    const deletedBenchmark = await Benchmark.findByIdAndDelete(req.params.id);
    if (!deletedBenchmark) {
      return res.status(404).json(new ApiError(404, "Benchmark not found"));
    }
    return res.json(
      new ApiResponse(
        200,
        { message: "Success" },
        "Benchmark deleted successfully"
      )
    );
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};
