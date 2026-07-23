const verifyRezorpaySignature = require("../config/verifyPayment");
const { publishPaymentSuccess } = require("../config/payment.producer");

const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const { data } = await axios.post(
      `${process.env.INTERNAL_PAYMENT_SERVICE_URL}/api/order/payment/${orderId}`,
      {
        headers: {
          "x-internal-key": process.env.INTERNAL_KEY,
        },
      },
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: data.amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${orderId}`,
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      key: process.env.REZORPAY_KRY_SECRET,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
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
