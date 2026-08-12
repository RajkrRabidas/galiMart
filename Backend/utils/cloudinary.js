const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadToCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  if (typeof file === "string") {
    return cloudinary.uploader.upload(file).then((result) => result.secure_url);
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    if (file.buffer) {
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } else if (file.path) {
      streamifier.createReadStream(file.path).pipe(uploadStream);
    } else {
      reject(new Error("Invalid file input for Cloudinary upload"));
    }
  });
};

module.exports = uploadToCloudinary;