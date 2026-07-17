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
        // require: true,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    phone: {
        type: Number,
        require: true,
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
        default: true
    }
},{timestamps: true});

shopSchema.index({ autoLocation: '2dsphere' });

const shopModel = mongoose.model("Shop", shopSchema)
module.exports = shopModel