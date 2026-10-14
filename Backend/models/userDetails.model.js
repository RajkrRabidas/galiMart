const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    mobile: {
      type: Number,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
    },
    formattedAddress: {
      type: String,
      required: true,
    },
    pinCode: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    locality: { type: String, trim: true },
    buildingName: { type: String, trim: true },
    landmark: { type: String, trim: true, default: "" },
    addressType: { type: String, enum: ["Home", "Work", "Other"] },
    isDefault: { type: Boolean, default: false },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
      },
    },
  },
  { timestamps: true },
);

userDetailsSchema.index({ location: "2dsphere" });
userDetailsSchema.index(
  { userId: 1, isDefault: 1 },
  { unique: true, partialFilterExpression: { isDefault: true } },
);
userDetailsSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } },
);
const userDetailsModel = mongoose.model("UserDetails", userDetailsSchema);
module.exports = userDetailsModel;
