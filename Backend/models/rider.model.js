const mongoose = require("mongoose")

const riderSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },

    picture: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },

    aadharNumber:{
        type: String,
        required: true
    },
    aadharImage: {
        type: String,
        required: true
    },
    drivingLicenseNumber:{
        type:String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    verificationReason: { type: String, trim: true, default: null },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    isSuspended: { type: Boolean, default: false },
    suspensionReason: { type: String, trim: true, default: null },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    lastActiveAt :{
        type: Date,
        default: Date.now
    }
},{timestamps:true})

riderSchema.index({ location: '2dsphere' });

const riderModel = mongoose.model("Rider", riderSchema)
module.exports = riderModel




