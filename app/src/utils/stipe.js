import Stripe from "stripe";
import { Product } from "../models/product.model.js";
import { ApiError } from "./ApiError.js";
import dotenv from "dotenv";
import { Credential } from "../models/credentials.model.js";
dotenv.config();

const orderWithStripeCheckOutPayment = async (
  username,
  email,
  products,
  shippingCharge = 0
) => {
  try {
    let stripe;

    const getCredencials = await Credential.findOne();

    if (getCredencials && getCredencials.stripeSecretKey) {
      stripe = new Stripe(getCredencials.stripeSecretKey);
    } else if (process.env.STRIPE_SECRET_KEY) {
      stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    } else {
      throw new ApiError(404, "Stripe secret key not found.");
    }

    const customer = await stripe.customers.create({
      name: username,
      email: email,
    });

    const lineItems = await Promise.all(
      products.items.map(async (product) => {
        const productData = await Product.findById({ _id: product.productId });

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: productData?.title,
            },
            unit_amount: product.price * 100, // convert to cent unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        };
      })
    );

    // Add a line item for shipping charge
    if (shippingCharge > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping Charge",
          },
          unit_amount: shippingCharge * 100, //conver to cent unit_amount: shippingCharge*100
        },
        quantity: 1,
      });
    }

    const stripeData = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: lineItems,
      mode: "payment",
      success_url: "https://ethnicfoods.com/paymentsucess",
      cancel_url: "https://ethnicfoods.com/PaymentCancel",
    });
    return stripeData;
  } catch (error) {
    throw new ApiError(
      400,
      "Error:",
      error.message ||
        error.Error ||
        "Something went wrong while stripe checkout."
    );
  }
};

export { orderWithStripeCheckOutPayment };
