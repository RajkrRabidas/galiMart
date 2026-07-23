const Rezorpay = require('razorpay');

require("dotenv").config();

const rezorpayInstance = new Rezorpay({
    key_id: process.env.REZORPAY_KEY_ID,
    key_secret: process.env.REZORPAY_KEY_SECRET
});

module.exports = rezorpayInstance;