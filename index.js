// ============================================
// FILE: index.js
// ============================================
import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fs from "fs";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

// Load environment variables
dotenv.config();

// ========================
// ✅ DEBUG ENV
// ========================
console.log("===================================");
console.log("🌩️  Cloudinary ENV Check");
console.log("Cloud Name :", process.env.CLOUDINARY_CLOUD_NAME || "❌ Missing");
console.log("API Key    :", process.env.CLOUDINARY_API_KEY || "❌ Missing");
console.log("API Secret :", process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing");
console.log("===================================");

const port = process.env.PORT || 6000;
const app = express();

// ========================
// ✅ CORS CONFIGURATION
// ========================

// Allowed origins: Local + Client + Admin + Main Domain
const allowedOrigins = [
  "http://localhost:5173", // local client
  "http://localhost:5174", // local admin
  "https://vkjwellersclient.vercel.app",
  "https://vkjwellers-admin.vercel.app",
  "https://www.shrivkjewellers.com" // ⭐ your main domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`❌ CORS Blocked for origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ========================
// ✅ MIDDLEWARE
// ========================
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// ========================
// ✅ ROUTES
// ========================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

// Root health route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ========================
// ✅ CONNECT DB AND START SERVER
// ========================
connectDb()
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  });

// ========================
// ✅ RAZORPAY DEBUG
// ========================
console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET ? "✅ Loaded" : "❌ Missing");
