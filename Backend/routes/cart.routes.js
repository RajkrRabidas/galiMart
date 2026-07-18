const express = require("express");
const {addToCart, fetchMyCart} = require("../controllers/shop.controller");
const { isAuth } = require("../middlewares/auth.middleware");

const router = espress.Router();


router.post("/add-to-card", isAuth, addToCart)
router.post("/all-cart",isAuth, fetchMyCart)


module.exports = router;