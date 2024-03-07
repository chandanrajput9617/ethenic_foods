import { Router } from "express";
import {
  createBenchmark,
  getAllBenchmarks,
  getOneBenchmark,
  updateBenchmark,
  deleteBenchmark,
} from "../controllers/product/benchmark.controller.js";

const router = Router();

router.route("/").post(createBenchmark).get(getAllBenchmarks);
router.route("/").put(updateBenchmark);

router.route("/:id").get(getOneBenchmark).delete(deleteBenchmark);

export default router;
