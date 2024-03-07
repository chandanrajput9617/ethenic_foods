import mongoose from "mongoose";

const benchmarkSchema = new mongoose.Schema({
  benchmark1: {
    type: Number,
    required: true,
  },
  benchmark2: {
    type: Number,
    required: true,
  },
});

export const Benchmark = mongoose.model("Benchmark", benchmarkSchema);
