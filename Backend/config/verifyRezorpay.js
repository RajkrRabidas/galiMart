const crypto = require('crypto');

const verifyPaymentSignature = (orderId, paymentId, signature) => {
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || process.env.REZORPAY_KEY_SECRET;

    if (!razorpayKeySecret) {
        throw new Error("RAZORPAY_KEY_SECRET is not configured");
    }

    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto.createHmac('sha256', razorpayKeySecret)
        .update(body.toString())
        .digest('hex');

    return signature === expectedSignature;
};

const verifyRezorpaySignature = verifyPaymentSignature;

module.exports = {
  verifyPaymentSignature,
  verifyRezorpaySignature,
};