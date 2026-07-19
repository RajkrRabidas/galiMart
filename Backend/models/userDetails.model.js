const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
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


const userDetailsModel = mongoose.model("UserDetails", userDetailsSchema);
module.exports = userDetailsModel;