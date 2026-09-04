const mongoose = require("mongoose");

const adminActivitySchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true, trim: true },
    entityType: { type: String, required: true, trim: true },
    entityId: { type: String, default: null },
    reason: { type: String, trim: true, default: null },
    metadata: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AdminActivity", adminActivitySchema);
