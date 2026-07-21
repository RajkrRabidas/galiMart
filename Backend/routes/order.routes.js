const express = require("express");
const { isAuth } = require("../middlewares/auth.middleware");
const { createOrder, fetchOrderForPayment } = require("../controllers/order.controller");

const router = express.Router();


router.post("/create", isAuth, createOrder);
router.get("/payment/:orderId", isAuth, fetchOrderForPayment);


module.exports = router;