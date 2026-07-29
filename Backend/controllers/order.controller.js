const asyncHandler = require("../utils/asyncHandler");
const userDetailsModel = require("../models/userDetails.model");
const cartModel = require("../models/cart.model");
const ShopModel = require("../models/shop.model");
const orderModel = require("../models/order");

const createOrder = asyncHandler(async (req, res) => {
  const { paymentMethod, addressId, riderDistance = 0 } = req.body;
  const userId = req.user._id.toString();

  if (!addressId)
    return res.status(400).json({ message: "Address is required" });
  if (!["cod", "razorpay", "stripe"].includes(paymentMethod))
    return res
      .status(400)
      .json({ message: "A valid payment method is required" });

  const address = await userDetailsModel.findOne({ _id: addressId, userId });
  if (!address) return res.status(404).json({ message: "Address not found" });

  const cartItems = await cartModel
    .find({ userId })
    .populate("itemId")
    .populate("shopId");
  if (!cartItems.length)
    return res.status(400).json({ message: "Cart is empty" });

  const shopId = cartItems[0].shopId?._id?.toString();
  if (
    !shopId ||
    cartItems.some(
      (cart) => !cart.itemId || cart.shopId?._id?.toString() !== shopId,
    )
  ) {
    return res
      .status(400)
      .json({ message: "Cart items must belong to one valid shop" });
  }

  const shop = await ShopModel.findById(shopId);
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  if (!shop.isOpen) return res.status(400).json({ message: "Shop is closed" });

  let subTotal = 0;
  const items = cartItems.map((cart) => {
    const total = cart.itemId.price * cart.quantity;
    subTotal += total;
    return {
      itemId: cart.itemId._id.toString(),
      name: cart.itemId.name,
      price: cart.itemId.price,
      quantity: cart.quantity,
      total,
    };
  });
  const deliveryFee = subTotal < 250 ? 49 : 0;
  const platformFee = Math.round(subTotal * 0.1 * 100) / 100;
  const [longitude, latitude] = address.location.coordinates;

  const order = await orderModel.create({
    userId,
    shopId,
    shopName: shop.name,
    items,
    subTotal,
    deliveryFee,
    platformFee,
    totalAmount: subTotal + deliveryFee + platformFee,
    addressId: address._id.toString(),
    deliveryAddress: {
      formattedAddress: address.formattedAddress,
      mobile: address.mobile,
      latitude,
      longitude,
    },
    riderDistance: Number(riderDistance) || 0,
    riderAmount: Math.ceil(Number(riderDistance) || 0) * 15,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await cartModel.deleteMany({ userId });
  res.status(201).json({
    message: "Order created successfully",
    orderId: order._id,
    amount: order.totalAmount,
    paymentMethod: order.paymentMethod,
  });
});

const fetchOrderForPayment = asyncHandler(async (req, res) => {
  if (req.headers["x-internal-key"] !== process.env.INTERNAL_KEY) {
    return res.status(403).json({
      message: "Forbidden",
    });
  }

  const order = await orderModel.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.paymentStatus === "paid")
    return res.status(400).json({ message: "Order is already paid" });
  if (order.paymentMethod === "cod")
    return res
      .status(400)
      .json({ message: "Cash on delivery does not require online payment" });
  res.json({ orderId: order._id, amount: order.totalAmount, currency: "INR" });
});

const fetchShopOrders = asyncHandler(async (req, res) => {
  const user = req.user;

  const { shopId } = req.params;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!shopId) {
    return res.status(400).json({ message: "Shop ID is required" });
  }

  const limit = req.query.limit ? parseInt(req.query.limit) : 5;

  const shop = await ShopModel.find({
    shopId,
    paymentStatus: "paid",
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  return res.status(200).json({
    message: "Orders fetched successfully",
    count: shop.length,
    orders: shop,
  });
});

const ALLOWED_STATUSES = ["accepted", "preparing", "ready_for_delivery"];

const updateOrderStatus = asyncHandler(async (req, res) => {
  const user = req.user;

  const { orderId } = req.params;
  const { status } = req.body;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await orderModel.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.paymentStatus !== "paid") {
    return res.status(400).json({ message: "Order not completed yet" });
  }

  const shop = await ShopModel.findById(order.shopId);
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }

  if (shop.ownerId.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ message: "you are not allowed to update this order" });
  }

  order.status = status;
  await order.save();

  axios.post(
    `${process.env.INTERNAL_API_URL}/api/realtime/emit`,
    {
      event: "order:updated",
      room: `user:${order.userId}`,
      paymentData: {
        orderId: order._id,
        status: order.status,
      },
    },
    {
      headers: {
        "x-internal-key": process.env.INTERNAL_KEY,
      },
    },
  );

  // now assign riders

  return res
    .status(200)
    .json({ message: "Order status updated successfully", order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  if(!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const order = await orderModel.find({
    userId: req.user._id.toString(),
    paymentStatus: "paid"
  }).sort({ createdAt: -1 });

  res.json({orders: order});
})

const fetchSingleOrder = asyncHandler(async (req, res) => {
  if(!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const order = await orderModel.findById({ _id: req.params.id });
  
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if(order.userId !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not authorized to view this order" });
  }

  res.json({ order });
})


module.exports = { 
  createOrder, 
  fetchOrderForPayment, 
  fetchShopOrders, 
  updateOrderStatus, 
  getMyOrders, 
  fetchSingleOrder 
};
