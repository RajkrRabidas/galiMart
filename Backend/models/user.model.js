const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // fullName: {
    //     type: String,
    //     required: true,
    // },
    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    // password: {
    //     type: String,
    // },
    phone: {
        type: String,
        required: true,
    },
    // address: {
    //     type: String,
    //     required: true,
    // },
    // pinCode: {
    //     type: String,
    //     required: true,
    // },
    // location: {
    //     type: {
    //         type: String,
    //         enum: ["Point"],
    //         required: true,
    //     },
    // },
    role: {
        type: String,
        enum: ["user", "shopkeeper", "service_provider", "delivery_partner", "admin"],
        default: "user",
        required: true,
    }

}, { timestamps: true });

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;