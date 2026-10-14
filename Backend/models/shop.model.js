const mongoose = require("mongoose")

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        require: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    phone: {
        type: Number,
        require: true,
    },
    aadharNumber: {
        type: String,
        trim: true,
        required: true,
    },
    aadharImage: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "suspended"],
        default: "pending",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationReason: { type: String, trim: true, default: null },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    autoLocation:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        formattedAddress: String,
    },
    isOpen:{
        type: Boolean,
        default: false
    },
    payoutDetails: {
        method: { type: String, enum: ["bank", "upi"], default: null },
        accountHolderName: { type: String, trim: true, default: null },
        accountLast4: { type: String, default: null },
        upiIdMasked: { type: String, default: null },
        encryptedPayload: { type: String, select: false, default: null },
        updatedAt: { type: Date, default: null },
    },
    shopType: {
        type: String,
        enum: ["groceries", "restaurants", "fashion", "medicine", "electronics", "services"],
        required: true,
    },
},{timestamps: true});

shopSchema.index({ autoLocation: '2dsphere' });

const shopModel = mongoose.model("Shop", shopSchema)
module.exports = shopModel