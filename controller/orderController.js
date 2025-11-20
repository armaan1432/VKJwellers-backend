import Order from "../model/orderModel.js";
import User from "../model/userModel.js";
import Product from "../model/productModel.js";
import razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const currency = "INR";
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// -------------------- USER CONTROLLERS -------------------- //

// Place COD Order
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const mappedItems = items.map(item => ({
      product: item._id,
      quantity: item.quantity,
      size: item.size,
    }));

    const newOrder = new Order({
      user: userId,
      items: mappedItems,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({ message: "Order Placed", orderId: newOrder._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Order Placement Error" });
  }
};

// Place Razorpay Order
export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    const mappedItems = items.map(item => ({
      product: item._id,
      quantity: item.quantity,
      size: item.size,
    }));

    const newOrder = new Order({
      user: userId,
      items: mappedItems,
      amount,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    });

    await newOrder.save();

    const options = {
      amount: Number(amount * 100), // in paise
      currency,
      receipt: newOrder._id.toString(),
      payment_capture: 1,
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpayInstance.orders.create(options);

    console.log("Razorpay order response:", order);

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify Razorpay Payment
export const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id } = req.body;

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });
      res.status(200).json({ message: "Payment Successful" });
    } else {
      res.json({ message: "Payment Failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get Orders of Logged-in User (null-safe)
export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product");

    const response = orders.map(order => ({
      _id: order._id,
      items: order.items
        .filter(item => item.product) // ignore deleted products
        .map(item => ({
          _id: item.product._id,
          name: item.product.name,
          image1: item.product.image1,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
        })),
      status: order.status,
      payment: order.payment,
      paymentMethod: order.paymentMethod,
      date: order.createdAt,
      amount: order.amount,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "userOrders error" });
  }
};

// -------------------- ADMIN CONTROLLERS -------------------- //

// Get All Orders (Admin) (null-safe)
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("items.product")
      .populate("user", "name email");

    const response = orders.map(order => ({
      _id: order._id,
      user: order.user,
      items: order.items
        .filter(item => item.product) // ignore deleted products
        .map(item => ({
          _id: item.product._id,
          name: item.product.name,
          image1: item.product.image1,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
        })),
      status: order.status,
      payment: order.payment,
      paymentMethod: order.paymentMethod,
      date: order.createdAt,
      amount: order.amount,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "adminAllOrders error" });
  }
};

// Update Order Status (Admin)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await Order.findByIdAndUpdate(orderId, { status });
    res.status(201).json({ message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// -------------------- TEST RAZORPAY ORDER --------------------
export const testRazorpayOrder = async (req, res) => {
  try {
    const options = {
      amount: 1000, // ₹10 in paise
      currency: currency,
      receipt: "test_receipt_001",
      payment_capture: 1,
    };

    console.log("Creating test Razorpay order:", options);

    const order = await razorpayInstance.orders.create(options);

    console.log("Test Razorpay order response:", order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Test Razorpay order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
