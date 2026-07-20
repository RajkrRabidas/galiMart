const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    
    userId: {
        type: String,
        required: true
    },
    shopId: {
        type: String,
        required: true
    },
    riderId: {
        type: String,
        default: null
    },
    riderName: {
        type: String,
    },
    riderPhone: {
        type: String,
        required: true
    },
    riderAmount: {
        type: Number,
        default: 0
    },
    riderDistance: {
        type: Number,
        default: 0
    },
    items: [{
        itemId: String,
        name: String,
        price: Number,
        quantity: Number,
    }],

    subTotal: Number,
    deliveryfee: Number,
    platformfee: Number,
    totalAmount: Number,
    
    address: {
        type: String,
        required: true
    },
    deliveryAddress: {
        formattedAddress: {type: String, required: true},
        mobile: {type: Number, required: true},
        latitude: Number,
        longitude: Number
    },

    status: {
        type: String,
        enum : ["placed", "accepted", "preparing", "ready", "pickedup", "delivered", "cancelled"],
        default: "placed"
    },

    paymentMethod: {
        type: String,
        enum : ["razorpay", "cod", "stripe"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum : ["pending", "paid", "failed"],
        default: "pending"
    },
    expiesAt: {
        type: Date,
        index: { expireAfterSeconds: 0 },
    }
}, { timestamps: true })

const orderModel = mongoose.model("Order", orderSchema)
module.exports = orderModel
