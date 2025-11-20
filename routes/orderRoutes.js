import express from 'express';
import isAuth from '../middleware/isAuth.js';
import adminAuth from '../middleware/adminAuth.js';
import {
  allOrders,
  placeOrder,
  placeOrderRazorpay,
  updateStatus,
  userOrders,
  verifyRazorpay,
  testRazorpayOrder // <-- added test route controller
} from '../controller/orderController.js';

const orderRoutes = express.Router();

// -------------------- USER ROUTES -------------------- //

// Place COD Order
orderRoutes.post("/placeorder", isAuth, placeOrder);

// Place Razorpay Order
orderRoutes.post("/razorpay", isAuth, placeOrderRazorpay);

// Get User Orders (populate product info)
orderRoutes.get("/userorder", isAuth, userOrders);

// Verify Razorpay Payment
orderRoutes.post("/verifyrazorpay", isAuth, verifyRazorpay);

// Test Razorpay Order (for backend debugging)
orderRoutes.get("/test-razorpay", testRazorpayOrder);

// -------------------- ADMIN ROUTES -------------------- //

// Get All Orders (Admin) with product & user info
orderRoutes.get("/list", adminAuth, allOrders);

// Update Order Status (Admin)
orderRoutes.post("/status", adminAuth, updateStatus);

export default orderRoutes;
