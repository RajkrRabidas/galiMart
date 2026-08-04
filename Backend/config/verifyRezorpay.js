const crypto = require('crypto');

const verifyPaymentSignature = (orderId, paymentId, signature) => {
    const body = `${orderId}|${paymentId}`;

    const expectedSignature = crypto.createHmac('sha256', process.env.REZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    return signature === expectedSignature;
}

module.exports = { verifyPaymentSignature };