const asyncHandler = require("../utils/asyncHandler");
const userDetailsModel = require("../models/userDetails.model");
const cartModel = require("../models/cart.model");
const ShopModel = require("../models/shop.model");
const OrderModel = require("../models/order");

const createOrder = asyncHandler(async (req, res) => {
  const { paymentMethod, addressId, riderDistance = 0 } = req.body;
  const userId = req.user._id.toString();

  if (!addressId) return res.status(400).json({ message: "Address is required" });
  if (!['cod', 'razorpay', 'stripe'].includes(paymentMethod)) return res.status(400).json({ message: "A valid payment method is required" });

  const address = await userDetailsModel.findOne({ _id: addressId, userId });
  if (!address) return res.status(404).json({ message: "Address not found" });

  const cartItems = await cartModel.find({ userId }).populate("itemId").populate("shopId");
  if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

  const shopId = cartItems[0].shopId?._id?.toString();
  if (!shopId || cartItems.some((cart) => !cart.itemId || cart.shopId?._id?.toString() !== shopId)) {
    return res.status(400).json({ message: "Cart items must belong to one valid shop" });
  }

  const shop = await ShopModel.findById(shopId);
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  if (!shop.isOpen) return res.status(400).json({ message: "Shop is closed" });

  let subTotal = 0;
  const items = cartItems.map((cart) => {
    const total = cart.itemId.price * cart.quantity;
    subTotal += total;
    return { itemId: cart.itemId._id.toString(), name: cart.itemId.name, price: cart.itemId.price, quantity: cart.quantity, total };
  });
  const deliveryFee = subTotal < 250 ? 49 : 0;
  const platformFee = Math.round(subTotal * 0.1 * 100) / 100;
  const [longitude, latitude] = address.location.coordinates;

  const order = await OrderModel.create({
    userId, shopId, shopName: shop.name, items, subTotal, deliveryFee, platformFee,
    totalAmount: subTotal + deliveryFee + platformFee, addressId: address._id.toString(),
    deliveryAddress: { formattedAddress: address.formattedAddress, mobile: address.mobile, latitude, longitude },
    riderDistance: Number(riderDistance) || 0, riderAmount: Math.ceil(Number(riderDistance) || 0) * 15,
    paymentMethod, paymentStatus: paymentMethod === "cod" ? "pending" : "pending", expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await cartModel.deleteMany({ userId });
  res.status(201).json({ message: "Order created successfully", orderId: order._id, amount: order.totalAmount, paymentMethod: order.paymentMethod });
});

const fetchOrderForPayment = asyncHandler(async (req, res) => {
  const order = await OrderModel.findOne({ _id: req.params.orderId, userId: req.user._id.toString() });
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.paymentStatus === "paid") return res.status(400).json({ message: "Order is already paid" });
  if (order.paymentMethod === "cod") return res.status(400).json({ message: "Cash on delivery does not require online payment" });
  res.json({ orderId: order._id, amount: order.totalAmount, currency: "INR" });
});

module.exports = { createOrder, fetchOrderForPayment };
