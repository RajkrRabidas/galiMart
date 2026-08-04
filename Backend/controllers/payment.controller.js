const jwt = require("jsonwebtoken");
const verifyRezorpaySignature = require("../config/verifyRezorpay");
const { publishPaymentSuccess } = require("../config/payment.producer");
const Order = require("../models/order.model");
const rezorpayInstance  = require("../config/rezorpay")

const createRazorpayOrder = async (req, res) => {
   try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const razorpayOrder = await rezorpayInstance.orders.create({
      amount: order.totalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${order._id}`,
    });

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  const {
    rezorpay_order_id,
    rezorpay_payment_id,
    rezorpay_signature,
    orderId,
  } = req.body;

  const isValid = verifyRezorpaySignature(
    rezorpay_order_id,
    rezorpay_payment_id,
    rezorpay_signature,
  );

  if (!isValid) {
    return res.status(400).json({ mesage: "payment verification failed" });
  }

  await publishPaymentSuccess({
    orderId,
    paymentId: rezorpay_payment_id,
    paymentMethod: "razorpay",
  });

  res.josn({
    message: "payment verified successfully",
  })
};


module.exports = {createRazorpayOrder, verifyRazorpayPayment}