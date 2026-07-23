const express = require("express")

const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/payment.controller")

const router = express.Router()


router.post("/create-payment", createRazorpayOrder)
router.post("/verify-payment", verifyRazorpayPayment)



module.exports = router