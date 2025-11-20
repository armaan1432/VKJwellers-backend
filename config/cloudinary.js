import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

// Load env vars
dotenv.config();

// ✅ Configure once globally
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Debug log (runs once at startup)
console.log("🌩️ Cloudinary Configured:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing",
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // Upload file
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // handles images, videos, etc.
    });

    // Remove local file after upload
    fs.unlinkSync(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
};

export default uploadOnCloudinary;
