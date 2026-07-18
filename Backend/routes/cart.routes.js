const express = require("express");
const { addToCart, fetchMyCart, incrementCartItem,decrementCartItem, clearCart} = require("../controllers/cart.controller");
const { isAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/add-to-card", isAuth, addToCart);
router.post("/all-cart", isAuth, fetchMyCart);
router.put("/inc", isAuth, incrementCartItem)
router.put("/dec", isAuth, decrementCartItem)
router.delete("/clear-cart", isAuth, clearCart)

module.exports = router;