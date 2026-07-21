const asyncHandler = require("../utils/asyncHandler");
const userDetailsModel = require("../models/userDetails.model");
const cartModel = require("../models/cart.model");
const ShopModel = require("../models/shop.model");

const createOrder = asyncHandler(async (req, res) => {
  const user = req.user;

  const { paymentMethod, addressId, riderDistance } = req.body;

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

  const cartItems = await cartModel
    .find({ userId: user._id })
    .populate("itemId")
    .populate("shopId");

  if (cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const firstItem = cartItems[0];
  if (!firstItem || !firstItem.shopId) {
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

  let subTotal = 0;

  const orderItem = cartItems.map((cart) => {
    const item = cart.itemId;

    if (!Item) {
      throw new Error("Item not found");
    }

    const itemTotal = item.price * cart.quantity;
    subTotal += itemTotal;

    return {
      itemId: item._id,
      name: item.name,
      price: item.price,
      quantity: cart.quantity,
      total: itemTotal,
    };
  });

  const deliveryfee = subTotal < 250 ? 49 : 0;
  const platformfee = subTotal * 0.1; // 10% platform fee
  const totalAmount = subTotal + deliveryfee + platformfee;

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 30 minutes from now

  const [longitude, latitude] = address.location.coordinates;

  const riderAmount = Math.ceil(riderDistance) * 15;

  const order = await OrderModel.create({
    userId: user._id.toString(),
    shopId: shop._id.toString(),
    shopName: shop.name,
    riderId: null,
    riderDistance,
    riderAmount,
    items: orderItem,
    subTotal,
    deliveryFee: deliveryfee,
    platformFee: platformfee,
    totalAmount,
    addressId: address._id.toString(),
    deliveryAddress: {
      formattedAddress: address.formattedAddress,
      mobile: address.mobile,
      latitude,
      longitude,
    },

    paymentMethod,
    status: "placed",
    paymentStatus: "pending",
    expiresAt,
  });

  await cartModel.deleteMany({ userId: user._id });

  res.json({
    message: "Order created successfully",
    ownerId: order._id,
    amount: order.totalAmount,
    paymentMethod: order.paymentMethod,
  });
});

const fetchOrderForPayment = asyncHandler(async (req, res) => {

  if(req.headers['x-api-key'] !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { orderId } = req.params;

  const order = await OrderModel.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if(order.paymentStatus === "pending" || order.paymentStatus === "paid") {
    return res.status(400).json({ message: "Order already paid" });
  }

  res.json({
    orderId: order._id,
    amount: order.totalAmount,
    currency: "INR",
  });

})
