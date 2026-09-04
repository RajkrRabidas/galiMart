const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: ["order", "shop", "rider", "payment", "other"], default: "other" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    status: { type: String, enum: ["open", "in_progress", "resolved", "rejected"], default: "open", index: true },
    adminReply: { type: String, trim: true, default: null },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Complaint", complaintSchema);
