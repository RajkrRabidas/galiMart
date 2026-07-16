const cloudinary = require("cloudinary")

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