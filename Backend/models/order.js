const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    shopId: { type: String, required: true, index: true },
    shopName: { type: String, required: true },
    riderId: { type: String, default: null },
    riderName: String,
    riderPhone: String,
    riderAmount: { type: Number, default: 0 },
    riderDistance: { type: Number, default: 0 },
    items: [
      {
        itemId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    subTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    addressId: { type: String, required: true },
    deliveryAddress: {
      formattedAddress: { type: String, required: true },
      mobile: { type: Number, required: true },
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["placed", "accepted", "preparing", "ready", "pickedup", "delivered", "cancelled"],
      default: "placed",
    },
    paymentMethod: { type: String, enum: ["razorpay", "cod", "stripe"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    expiresAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
