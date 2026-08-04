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
    formattedAddress: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  { timestamps: true },
);

userDetailsSchema.index({ location: "2dsphere" });
userDetailsSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } },
);
const userDetailsModel = mongoose.model("UserDetails", userDetailsSchema);
module.exports = userDetailsModel;
