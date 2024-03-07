import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import compression from "compression";
import helmet from "helmet";

const app = express();

// if (process.env.NODE_ENV === "production") {
//   app.use(
//     cors({
//       origin: process.env.PRODUCTION_APP_BASE_API,
//       credentials: true,
//     })
//   );
// } else {
//   app.use(
//     cors({
//       origin: `http://localhost:${process.env.PORT}`,
//       credentials: true,
//     })
//   );
// }

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(morgan("dev"));
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/order/stripe-webhook") {
    next();
  } else {
    express.json({ extended: false, limit: "50mb" })(req, res, next);
  }
});

app.use(
  express.urlencoded({ limit: "50mb", extended: false, parameterLimit: 50000 })
);

app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import viewsRouter from "./routes/views.routes.js";
import freeZipCodeRouter from "./routes/freeZipCode.routes.js";
import benchmarkRouter from "./routes/benchmark.routes.js";
import fixedShippingPriceRouter from "./routes/fixedShippingPrice.routes.js";
import shipmentRateStateRouter from "./routes/shipmentRateState.routes.js";
import dimensionsRouter from "./routes/dimensions.routes.js";
import taxRouter from "./routes/tax.routes.js";
import contactUsRouter from "./routes/contactUs.routes.js";
import socialMedialinkRouter from "./routes/socialMediaLink.routes.js";
import credentialRouter from "./routes/credentials.routes.js";
import mailRouter from "./routes/mail.routes.js";
//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/views", viewsRouter);
app.use("/api/v1/free-zip-codes", freeZipCodeRouter);
app.use("/api/v1/benchmarks", benchmarkRouter);
app.use("/api/v1/fixed-shipping-prices", fixedShippingPriceRouter);
app.use("/api/v1/shipment-rate-state", shipmentRateStateRouter);
app.use("/api/v1/dimensions", dimensionsRouter);
app.use("/api/v1/tax", taxRouter);
app.use("/api/v1/contact-us", contactUsRouter);
app.use("/api/v1/social-media-link", socialMedialinkRouter);
app.use("/api/v1/credentials", credentialRouter);
app.use("/api/v1/mail", mailRouter);

export { app };
