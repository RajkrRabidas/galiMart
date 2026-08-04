const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    shopId: { type: String, required: true, index: true },
    shopName: { type: String, required: true },
    riderId: { type: String, default: null },
    riderName: { type: String, default: null },
    riderPhone: { type: String, default: null },
    riderAmount: { type: Number, required: true },
    riderDistance: { type: Number, required: true },
    items: [
      {
        itemId: String,
        name: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],
    subTotal: { type: Number, required: true },
    deliveryFee: Number,
    platformFee: Number,
    totalAmount: Number,
    addressId: { type: String, required: true },
    deliveryAddress: {
      formattedAddress: { type: String, required: true },
      mobile: { type: Number, required: true },
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["placed", "accepted", "preparing", "ready_for_rider", "rider_assigned", "picked_up", "delivered", "cancelled"],
      default: "placed",
    },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    expiresAt: {type: Date, index: {expireAfterSeconds: 0}},
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
