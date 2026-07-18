const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        required: true,
        index: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
        index: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
})

cartSchema.index({userId: 1, shopId: 1, itemId: 1},{unique: true})


const cartModel = mongoose.model("cart", cartSchema)

module.exports = cartModel