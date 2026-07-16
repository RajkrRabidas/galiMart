const cloudinary = require("cloudinary")
const shopModel = require("../models/shop.model")

const uploadToCloudinary = async (req, res) => {
    try{
        const {buffer} = req.body

        const cloud = await cloudinary.v2.upload(buffer)

        res.json({
            url: cloud.secure_url,
        })
    }catch(error){
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const CreateShop  = async (req, res) => {
    const user = req.user;

    if(!user){
        return res.status(401).json({ message: "Unauthorized" });
    }

    const existingShop = await shopModel.findOne({ ownerId: user._id });

    if(existingShop){
        return res.status(400).json({ message: "Shop already exists" });
    }

    const { name, description, image, phone, latitude, longitude, formatted } = req.body;

    if(!name || !latitude || !longitude) {
        return res.status(400).json({ message: "Please give all details" });
    }

    const file = req.file

    if(!file){
        return res.status(400).json({message: "please give image"})
    }

    const fileBuffer = getBuffer(file)

    if(!fileBuffer){
        return res.status(500).json({message:"Filed to Create file Buffer"})
    }

    
}