import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { orderWithStripeCheckOutPayment } from "../../utils/stipe.js";
import { User } from "../../models/user.model.js";
import { Order } from "../../models/order.model.js";
import { Cart } from "../../models/cart.model.js";
import Stripe from "stripe";
import { OrderHistory } from "../../models/orderHistory.model.js";
import { emptyCartAfterOrder } from "../../services/repository.js";
import { Product } from "../../models/product.model.js";
import { sendOrderConfirmationEmail } from "../../utils/mail.js";
import { Credential } from "../../models/credentials.model.js";

const getProductIds = async (products) => {
  const productPromises = products.map(async (product) => product.productId);
  const resolvedProductIds = await Promise.all(productPromises);
  return resolvedProductIds;
};

const orderProductPaymentWithStripe = asyncHandler(async (req, res) => {
  const { id: cartId } = req.params;

  const orderDate = new Date().getDate();

  if (!cartId) {
    throw new ApiError(400, "Cart id is required");
  }

  const cartData = await Cart.findById({
    _id: cartId,
  });

  if (!cartData) {
    throw new ApiError(409, "Cart  not found!");
  }

  const existedUser = await User.findById({ _id: cartData.user_id });

  if (!existedUser) {
    throw new ApiError(409, "User not found!");
  }

  const stripeOrderData = await orderWithStripeCheckOutPayment(
    existedUser.username,
    existedUser.email,
    cartData,
    cartData.shippingCharge
  );

  if (!stripeOrderData.id) {
    throw new ApiError(409, "Something went wrong while order payment process");
  }

  let orderData = null;
  if (stripeOrderData.id) {
    const productIds = await getProductIds(cartData.items);

    const order = new Order({
      user_id: existedUser._id,
      username: existedUser.username,
      email: existedUser.email,
      products: productIds,
      pyamentOrderId: stripeOrderData.id,
      status: "pending",
      items: cartData?.items,
      shipment_delivery_message: cartData?.shipment_delivery_message,
      tax: cartData?.tax,
      shippingCharge: cartData?.shippingCharge,
      subTotal: cartData?.subTotal,
    });
    orderData = await order.save();

    // empty card after order
    await emptyCartAfterOrder(existedUser._id);

    if (!orderData) {
      throw new ApiError(
        409,
        "Something went wrong while inserting order data"
      );
    }

    await OrderHistory.create({
      userId: existedUser._id,
      orderId: orderData._id,
    });
  }
  orderData = { ...orderData, sessionID: stripeOrderData?.id };
  return res
    .status(201)
    .json(new ApiResponse(200, orderData, "Stipe Process successfully"));
});

const orderSuccess = asyncHandler(async (req, res) => {
  res.sendStatus(200).json("Payment successfull!");
});

const stripeWebHookHandler = asyncHandler(async (req, response) => {
  const payload = req.body;
  const sig = req.headers["stripe-signature"];

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STIPE_ENDPOINT_SECRET) {
    console.error("Stripe environment variables are not set.");
    response.status(500).send("Internal Server Error");
    return;
  }

  let stripe;
  let stripeEndpointSecret;

  const getCredencials = await Credential.findOne();

  if (getCredencials && getCredencials.stripeSecretKey) {
    stripe = new Stripe(getCredencials.stripeSecretKey);
    stripeEndpointSecret = getCredencials?.stripeEndpointSecret;
  } else if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(
      process.env.STRIPE_SECRET_KEY && process.env.STIPE_ENDPOINT_SECRET
    );
    stripeEndpointSecret = process.env.STIPE_ENDPOINT_SECRET;
  } else {
    throw new ApiError(404, "Stripe secret key not found.");
  }
  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, stripeEndpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let orderData = null;
  switch (event.type) {
    case "checkout.session.completed":
      orderData = await handleCheckoutSessionCompleted(event?.data?.object?.id);
      if (orderData) {
        await sendOrderConfirmationEmail(
          orderData?.email,
          orderData?._id,
          orderData?.subTotal,
          orderData?.items
        );
      }
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return response.send();
});

const handleCheckoutSessionCompleted = async (orderId) => {
  if (!orderId) {
    return;
  }

  try {
    const orderUpdateData = await Order.findOneAndUpdate(
      { pyamentOrderId: orderId },
      { status: "fulfilled" },
      { new: true }
    );

    return orderUpdateData;
  } catch (error) {
    console.error(`Error updating order ${orderId}:`, error);
    return;
  }
};

const getAllOrder = asyncHandler(async (req, res) => {
  const { _id, username, email, products, title } = req.query;

  let filter = {};

  if (_id) {
    filter._id = _id;
  }

  if (username) {
    filter.username = username;
  }

  if (email) {
    filter.email = email;
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit);

  let options = { page };

  if (limit) {
    options = { page, limit };
  }

  try {
    const getAllOrderData = await Order.paginate(filter, {
      ...options,
      sort: { createdAt: -1 },
    });

    const productIds = getAllOrderData.docs.reduce((ids, order) => {
      return ids.concat(order.products);
    }, []);

    const userIds = getAllOrderData.docs.reduce((ids, order) => {
      return ids.concat(order.user_id);
    }, []);

    const productsDetails = await Product.find({ _id: { $in: productIds } });
    const usersDetails = await User.find({ _id: { $in: userIds } });

    const ordersWithProductDetails = getAllOrderData.docs.map((order) => {
      const orderProducts = order.products
        .map((productId) => {
          return productsDetails.find((product) =>
            product._id.equals(productId)
          );
        })
        .filter((product) => product !== undefined);

      const orderUsers = usersDetails.find((userId) =>
        userId._id.equals(order.user_id)
      );

      return {
        ...order.toObject(),
        products: orderProducts,
        userDetails: orderUsers,
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { ...getAllOrderData, docs: ordersWithProductDetails },
          "All order data retrieved successfully."
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error retrieving order data.");
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Order Id is required.");
  }
  try {
    const orderUpdate = await Order.findByIdAndUpdate(
      id,
      {
        status: "delivered",
      },
      { new: true }
    );

    if (!orderUpdate) {
      throw new ApiError(400, "Something went wrong while updating order.");
    }

    res
      .status(200)
      .json(new ApiResponse(200, orderUpdate, "Order update successfully."));
  } catch (error) {
    throw new ApiError(500, "Order update error.");
  }
});

export {
  orderProductPaymentWithStripe,
  orderSuccess,
  stripeWebHookHandler,
  getAllOrder,
  updateOrderStatus,
};
