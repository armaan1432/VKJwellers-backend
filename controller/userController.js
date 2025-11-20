import User from "../model/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import { genToken, genToken1 } from "../config/token.js";

// Determine if we're in production
const isProduction = process.env.NODE_ENV === 'production';

// Cookie options for user login
const userCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

// Cookie options for admin login
const adminCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "None" : "Lax",
  path: "/",
  maxAge: 1 * 24 * 60 * 60 * 1000
};

// ==========================
//   USER REGISTRATION
// ==========================
export const registration = async (req, res) => {
  try {
    console.log("📩 Registration request:", req.body);

    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid Email" });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Enter Strong Password" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashPassword });
    
    const token = await genToken(user._id);

    res.cookie("token", token, userCookieOptions);

    console.log("✅ Registration successful:", user._id);
    console.log("🍪 Cookie set with token:", token?.substring(0, 20) + "...");

    return res.status(201).json(user);
  } catch (error) {
    console.log("🔥 registration error:", error);
    return res.status(500).json({ message: `registration error ${error}` });
  }
};

// ==========================
//   USER LOGIN
// ==========================
export const login = async (req, res) => {
  try {
    console.log("➡ Login request:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User is not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = await genToken(user._id);
    
    console.log("🔍 Generated token type:", typeof token);
    console.log("🔍 Token preview:", token?.substring(0, 30) + "...");

    res.cookie("token", token, userCookieOptions);
    
    console.log("✅ Login successful:", user._id);
    console.log("🍪 Cookie options:", userCookieOptions);

    return res.status(200).json(user);
  } catch (error) {
    console.log("🔥 login error:", error);
    return res.status(500).json({ message: `Login error ${error}` });
  }
};

// ==========================
//   USER LOGOUT
// ==========================
export const logOut = async (req, res) => {
  try {
    console.log("🚪 Logging out user");

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
    });

    return res.status(200).json({ message: "logOut successful" });
  } catch (error) {
    console.log("🔥 logOut error", error);
    return res.status(500).json({ message: `LogOut error ${error}` });
  }
};

// ==========================
//   GOOGLE LOGIN
// ==========================
export const googleLogin = async (req, res) => {
  try {
    console.log("🌐 Google login request:", req.body);

    const { name, email } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email });
      console.log("🆕 Google user created:", user._id);
    }

    const token = await genToken(user._id);

    res.cookie("token", token, userCookieOptions);

    console.log("✅ Google login successful:", user._id);
    console.log("🍪 Cookie set with token:", token?.substring(0, 20) + "...");
    
    return res.status(200).json(user);
  } catch (error) {
    console.log("🔥 googleLogin error:", error);
    return res.status(500).json({ message: `googleLogin error ${error}` });
  }
};

// ==========================
//      ADMIN LOGIN
// ==========================
export const adminLogin = async (req, res) => {
  try {
    console.log("🛑 Admin login attempt:", req.body.email);

    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = await genToken1(email);

      res.cookie("admintoken", token, adminCookieOptions);

      console.log("🔐 Admin login successful");
      console.log("🍪 Admin token preview:", token?.substring(0, 20) + "...");
      
      return res.status(200).json({ token });
    }

    console.log("❌ Invalid admin credentials");
    return res.status(400).json({ message: "Invalid credentials" });
  } catch (error) {
    console.log("🔥 AdminLogin error:", error);
    return res.status(500).json({ message: `AdminLogin error ${error}` });
  }
};

// ==========================
//   GET CURRENT USER
// ==========================
export const getCurrentUser = async (req, res) => {
  try {
    console.log("👤 Getting current user:", req.userId);
    
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log("✅ Current user found:", user.email);
    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ getCurrentUser error:", error);
    return res.status(500).json({ message: `getCurrentUser error: ${error.message}` });
  }
};

// ==========================
//   GET ADMIN
// ==========================
export const getAdmin = async (req, res) => {
  try {
    const adminEmail = req.adminId;
    
    console.log("🛑 Getting admin:", adminEmail);
    
    if (!adminEmail) {
      return res.status(404).json({ message: "Admin not found" });
    }
    
    return res.status(200).json({
      email: adminEmail,
      role: "admin",
    });
  } catch (error) {
    console.error("❌ getAdmin error:", error);
    return res.status(500).json({ message: `getAdmin error: ${error.message}` });
  }
};