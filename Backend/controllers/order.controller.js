const asyncHandler = require("../utils/asyncHandler");
const userDetailsModel = require("../models/userDetails.model");
const cartModel = require("../models/cart.model");
const ShopModel = require("../models/shop.model");

const createOrder = asyncHandler(async (req, res) => {
  const user = req.user;

  const { paymentMethod, addressId } = req.body;

  if (!addressId) {
    return res.status(400).json({ message: "Address is required" });
  }

  const address = await userDetailsModel.findById({
    _id: addressId,
    userId: user._id,
  });

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  const cartItems = await cartModel.find({ userId: user._id }).populate("itemId").populate("shopId");

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const firstItem = cartItems[0];
if(!firstItem || !firstItem.shopId) {
    return res.status(400).json({ message: "Invalid cart item" });
}

    const shopId = firstItem.shopId._id;

    const shop = await ShopModel.findById(shopId);
    if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
    }

    if (!shop.isOpen) {
        return res.status(404).json({ message: "Shop is closed" });
    }


});
