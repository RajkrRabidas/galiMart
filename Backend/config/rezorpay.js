const Rezorpay = require('razorpay');

require("dotenv").config();

const rezorpayInstance = new Rezorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports = rezorpayInstance;