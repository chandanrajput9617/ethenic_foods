import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config();

import config from "./utils/config.js";

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`⚙️ Server is running at port : ${config.port}`);
    });
  })
  .catch((err) => {
    console.log("Server failed to start:", err);
    process.exit(1); // Exit the process with an error code
  });
