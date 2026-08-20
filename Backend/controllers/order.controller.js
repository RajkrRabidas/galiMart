const asyncHandler = require("../utils/asyncHandler");
const userDetailsModel = require("../models/userDetails.model");
const cartModel = require("../models/cart.model");
const ShopModel = require("../models/shop.model");
const orderModel = require("../models/order");
const { publishOrderEvent } = require("../config/payment.producer");
const { emitRealtimeEvent } = require("../services/realtime.service");

const createOrder = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { paymentMethod, addressId } = req.body;

  if (!addressId)
    return res.status(400).json({ message: "Address is required" });

  const address = await userDetailsModel.findOne({
    _id: addressId,
    userId: user._id,
  });
  if (!address) return res.status(404).json({ message: "Address not found" });

  const getDistanceKM = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const deg2rad = (degrees) => (degrees * Math.PI) / 180;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return +(R * c).toFixed(2); // Distance in km
  };

  const cartItems = await cartModel
    .find({ userId: user._id })
    .populate("itemId")
    .populate("shopId");
  if (cartItems.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  const firstCartItem = cartItems[0];

  if (!firstCartItem || !firstCartItem.shopId) {
    return res.status(400).json({ message: "Invaild cart Data" });
  }

  const shop = firstCartItem.shopId;
  if (!shop) return res.status(404).json({ message: "Shop not found" });
  const shopId = shop._id.toString();
  if (!shop.isOpen) return res.status(400).json({ message: "Shop is closed" });

  const addressCoordinates = address.location?.coordinates;
  const shopCoordinates = shop.autoLocation?.coordinates;
  if (
    !Array.isArray(addressCoordinates) ||
    addressCoordinates.length < 2 ||
    !Array.isArray(shopCoordinates) ||
    shopCoordinates.length < 2 ||
    !addressCoordinates.slice(0, 2).every(Number.isFinite) ||
    !shopCoordinates.slice(0, 2).every(Number.isFinite)
  ) {
    return res.status(400).json({ message: "Invalid address or shop location" });
  }

  const distance = getDistanceKM(
    addressCoordinates[1],
    addressCoordinates[0],
    shopCoordinates[1],
    shopCoordinates[0]
  );

  let subTotal = 0;

  const orderItems = cartItems.map((cart) => {
    const item = cart.itemId;

    if (!item) {
      throw new Error("Invalid cart item");
    }

    const itemTotal = item.price * cart.quantity;
    subTotal += itemTotal;
    return {
      itemId: item._id.toString(),
      name: item.name,
      price: item.price,
      quantity: cart.quantity,
      total: itemTotal,
    };
  });
  const deliveryFee = subTotal < 250 ? 49 : 0;
  const platformFee = 7;
  const totalAmount = subTotal + deliveryFee + platformFee;

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

  const [longitude, latitude] = addressCoordinates;

  const order = await orderModel.create({
    userId: user._id.toString(),
    shopId,
    shopName: shop.name,
    riderId: null,
    items: orderItems,
    subTotal,
    deliveryFee,
    platformFee,
    totalAmount,
    addressId: address._id.toString(),
    deliveryAddress: {
      formattedAddress: address.formattedAddress,
      mobile: address.mobile,
      latitude,
      longitude,
    },
    riderDistance: distance,
    riderAmount: Math.ceil(distance || 0) * 17,
    paymentMethod,
    paymentStatus: "pending",
    status: "placed",
    expiresAt,
  });

  res.status(201).json({
    message: "Order created successfully",
    orderId: order._id.toString(),
    amount: order.totalAmount,
    paymentMethod: order.paymentMethod,
  });
});

const fetchOrderForPayment = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.paymentStatus !== "pending")
    return res.status(400).json({ message: "Order is already paid" });
  if (order.paymentMethod === "cod")
    return res
      .status(400)
      .json({ message: "Cash on delivery does not require online payment" });
  res.json({
    orderId: order._id.toString(),
    amount: order.totalAmount,
    currency: "INR",
  });
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

  const limit = req.query.limit ? parseInt(req.query.limit) : 0;

  const orders = await orderModel
    .find({
      shopId,
      paymentStatus: "paid",
    })
    .sort({ createdAt: -1 })
    .limit(limit);

  return res.status(200).json({
    message: "Orders fetched successfully",
    count: orders.length,
    orders,
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

  emitRealtimeEvent({
    event: "order:updated",
    room: `user:${order.userId}`,
    payload: {
      orderId: order._id,
      status: order.status,
    },
  });

  // now assign riders

  if (status === "ready_for_delivery") {
    console.log(
      "Publishing Order ready for rider event for order",
      order._id.toString(),
    );

    await publishOrderEvent("order.ready_for_rider", {
      orderId: order._id.toString(),
      shopId: order.shopId.toString(),
      shopName: order.shopName,
      location: order.deliveryAddress,
    });

    console.log("event Published successfully");
  }

  return res
    .status(200)
    .json({ message: "Order status updated successfully", order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const order = await orderModel
    .find({
      userId: req.user._id.toString(),
      paymentStatus: "paid",
    })
    .sort({ createdAt: -1 });

  res.json({ orders: order });
});

const fetchSingleOrder = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const order = await orderModel.findById({ _id: req.params.id });

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to view this order" });
  }

  res.json({ order });
});

const assignRiderToOrder = asyncHandler(async (req, res) => {
  const { orderId, riderId, riderName, riderPhone } = req.body;

  const orderAvailable = await orderModel.findOne({
    riderId,
    status: { $ne: "delivered" },
  });

  if (orderAvailable) {
    return res.status(400).json({ message: "you already have an order" });
  }

  const order = await orderModel.findById(orderId);

  if (order?.riderId !== null) {
    return res.status(400).json({ message: "order already taken" });
  }

  const orderUpdated = await orderModel.findOneAndUpdate(
    { _id: orderId, riderId: null },
    {
      riderId,
      riderName,
      riderPhone,
      status: "rider_assigned",
    },
    { returnDocument: "after" },
  );

  emitRealtimeEvent({
    event: "order:rider_assigned",
    room: `shop:${order.shopId}`,
    payload: order,
  });

  emitRealtimeEvent({
    event: "order:rider_assigned",
    room: `user:${order.userId}`,
    payload: order,
  });

  res.json({
    message: "Rider assigned Successfully",
    success: true,
    order: orderUpdated,
  });
});

const getCurrentOrdersForRider = asyncHandler(async (req, res) => {
  const { riderId } = req.query;

  if (!riderId) {
    return res.status(400).json({ message: "Rider ID is required" });
  }

  const orders = await orderModel
    .find({
      riderId: riderId,
      status: { $ne: ["delivered"] },
    })
    .sort({ createdAt: -1 })
    .populate("shopId");

  if (!orders) {
    return res.status(404).json({ message: "No orders found for this rider" });
  }

  res.json(orders);
});

const updateOrderStatusRider = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await orderModel.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status === "rider_assigned") {
    order.status = "picked_up";
    await order.save();

    emitRealtimeEvent({
      event: "order:rider_assigned",
      room: `user:${order.userId}`,
      payload: order,
    });

    emitRealtimeEvent({
      event: "order:rider_assigned",
      room: `shop:${order.shopId}`,
      payload: order,
    });

    return res.json({ message: "Order status updated successfully", order });
  }

  if (order.status === "picked_up") {
    order.status = "delivered";
    await order.save();

    emitRealtimeEvent({
      event: "order:rider_assigned",
      room: `user:${order.userId}`,
      payload: order,
    });

    emitRealtimeEvent({
      event: "order:rider_assigned",
      room: `shop:${order.shopId}`,
      payload: order,
    });

    return res.json({ message: "Order status updated successfully", order });
  }

  return res
    .status(400)
    .json({ message: "Order cannot be updated in this state" });
});

module.exports = {
  createOrder,
  fetchOrderForPayment,
  fetchShopOrders,
  updateOrderStatus,
  getMyOrders,
  fetchSingleOrder,
  assignRiderToOrder,
  getCurrentOrdersForRider,
  updateOrderStatusRider,
};
