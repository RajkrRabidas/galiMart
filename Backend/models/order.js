const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    shopId: { type: String, required: true, index: true },
    shopName: { type: String, required: true },
    shopPhone: { type: String, default: null },
    pickupAddress: { type: String, default: null },
    riderId: { type: String, default: null },
    riderName: { type: String, default: null },
    riderPhone: { type: Number, default: null },
    riderAmount: { type: Number, required: true },
    riderDistance: { type: Number, required: true },
    items: [
      {
        itemId: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],
    subTotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 },
    customerPayable: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    sellerCommissionPercent: { type: Number, default: 10 },
    sellerCommissionAmount: { type: Number, default: 0 },
    sellerPayout: { type: Number, default: 0 },
    riderPayout: { type: Number, default: 0 },
    riderIncentive: { type: Number, default: 0 },
    platformRevenue: { type: Number, default: 0 },
    settlementStatus: {
      type: String,
      enum: ["pending", "settled", "partial_refund", "refunded", "cancelled"],
      default: "pending",
    },
    refundAmount: { type: Number, default: 0 },
    addressId: { type: String, required: true },
    deliveryAddress: {
      fullName: { type: String, default: "Customer" },
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
