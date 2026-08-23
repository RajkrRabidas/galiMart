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




