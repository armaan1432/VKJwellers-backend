import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    // Read admin token from cookie
    const token = req.cookies.admintoken;
    console.log("🟢 AdminAuth: admintoken =", token ? "✅ Present" : "❌ Missing");

    if (!token) {
      console.log("❌ No admin token found");
      return res.status(401).json({ message: "Admin not authorized. Please login." });
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Admin token verified:", verified);

    // ✅ Fixed: genToken1 stores adminId, not email
    req.adminId = verified.adminId;
    req.adminEmail = verified.adminId; // adminId contains the email

    console.log("👤 Authenticated admin:", req.adminId);

    next();
  } catch (error) {
    console.log("❌ adminAuth error:", error.message);
    return res.status(401).json({ message: `Admin authentication failed: ${error.message}` });
  }
};

export default adminAuth;