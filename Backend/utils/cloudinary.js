const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const uploadToCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
  try {
    const upload = await cloudinary.uploader.upload(file)
    fs.unlinkSync(file); // Delete the temporary file
    return upload.secure_url;
  } catch (error) {
    fs.unlinkSync(file); // Delete the temporary file
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

module.exports = uploadToCloudinary;