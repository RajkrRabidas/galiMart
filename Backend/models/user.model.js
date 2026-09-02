const mongoose = require("mongoose");
const ROLES = require("../constants/roles");

const normalizePhone = (value) => {
  if (value === null || value === undefined) return "";

  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";

  const withoutCountryCode = digits.startsWith("91") ? digits.slice(2) : digits;
  const withoutLeadingZero = withoutCountryCode.startsWith("0") ? withoutCountryCode.slice(1) : withoutCountryCode;

  return withoutLeadingZero;
};

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      set: normalizePhone,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.statics.normalizePhone = normalizePhone;

userSchema.pre("save", function (next) {
  if (this.phone) {
    this.phone = normalizePhone(this.phone);
  }

  if (typeof next === "function") {
    next();
  }
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update && typeof update === "object") {
    if (update.$set && typeof update.$set.phone !== "undefined") {
      update.$set.phone = normalizePhone(update.$set.phone);
    }

    if (typeof update.phone !== "undefined") {
      update.phone = normalizePhone(update.phone);
    }
  }

  if (typeof next === "function") {
    next();
  }
});

// Ensure only documents with a real email string are indexed as unique
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $type: "string" } } },
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;