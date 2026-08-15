const mongoose = require("mongoose");
const cartModel = require("../models/cart.model");
const asyncHandler = require("../utils/asyncHandler");

const addToCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(400).json({ message: "please login" });
  }

  const { shopId, itemId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(shopId) ||
    !mongoose.Types.ObjectId.isValid(itemId)
  ) {
    return res.status(400).json({ message: "Invalid shopId or itemId" });
  }

  const cartFromDifferentShop = await cartModel.findOne({
    userId: req.user._id,
    shopId: { $ne: shopId },
  });

  if (cartFromDifferentShop) {
    return res.status(400).json({
      message:
        "You already have items from a different shop in your cart, please clear your cart first",
    });
  }

  const cartItem = await cartModel.findOneAndUpdate(
    {
      userId: req.user._id,
      shopId,
      itemId,
    },
    {
      $inc: { quantity: 1 },
      $setOnInsert: { userId: req.user._id, shopId, itemId },
    },
    {
      upsert: true,
      returnDocument: 'after',
      setDefaultsOnInsert: true,
    },
  );

  res.status(200).json({
    success: true,
    message: "Item added to cart successfully",
    cartItem,
  });
});

const fetchMyCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "please login" });
  }

  const userId = req.user._id;

  const cartItems = await cartModel
    .find({ userId })
    .populate("itemId")
    .populate("shopId");

  let subTotal = 0;
  let cartLength = 0;

  for (const cartItem of cartItems) {
    const item = cartItem.itemId;

    subTotal += item.price * cartItem.quantity;
    cartLength += cartItem.quantity;
  }

  return res.json({ success: true, cartLength, subTotal, cart: cartItems });
});

const incrementCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const { itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const cartItem = await cartModel.findOneAndUpdate(
    { userId, itemId },
    { $inc: { quantity: 1 } },
    { returnDocument: 'after' },
  );

  if (!cartItem) {
    return res.status(404).json({ message: "Item not Found" });
  }

  res.json({
    message: "Quantity increased",
    cartItem,
  });
});

const decrementCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const { itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const cartItem = await cartModel.findOne({ userId, itemId });

  if (!cartItem) {
    return res.status(404).json({ message: "Item not Found" });
  }

  if (cartItem.quantity === 1) {
    await cartModel.deleteOne({ userId, itemId });

    return res.json({ message: "Item removed from cart" });
  }

  cartItem.quantity -= 1;

  await cartItem.save();

  res.json({
    message: "Quantity decreased",
    cartItem,
  });
});

const clearCart = asyncHandler(async (req, res) => {

    const userId = req.user?._id

    if(!userId){
        return res.status(401).json({message: "unauthorized"})
    }

    await cartModel.deleteMany({userId})

    res.json({message: "cart cleared successfully"})
});

module.exports = {
  addToCart,
  fetchMyCart,
  incrementCartItem,
  decrementCartItem,
  clearCart
};
