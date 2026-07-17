const mongoose = require("mongoose")

const shopMenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
        index: true,
    },
    category: {
        type: String,
        enum: ["veg", "non veg"],
    },
    isAvailable: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true })

const shopMenuModel = mongoose.model("MenuItem", shopMenuSchema)

module.exports = shopMenuModel