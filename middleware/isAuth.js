
// ============================================
// FILE 4: middleware/isAuth.js
// ============================================
import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check User Cookie Token
    if (req.cookies?.token) {
      token = req.cookies.token;
      console.log("🟢 Token from user cookie:", token);
    }

    // 2️⃣ Check Admin Cookie Token
    else if (req.cookies?.admintoken) {
      token = req.cookies.admintoken;
      console.log("🟢 Token from admin cookie:", token);
    }

    // 3️⃣ Check Authorization Header (optional for mobile / API calls)
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🟢 Token from header:", token);
    }

    // 4️⃣ No token found
    if (!token) {
      console.log("⚠️ No token found");
      return res.status(401).json({ message: "No token. Unauthorized" });
    }

    // 5️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🟢 Token verified:", decoded);

    // 6️⃣ If user login (normal user)
    if (decoded.userId) {
      req.userId = decoded.userId;
      console.log("👤 Authenticated user:", req.userId);
    }

    // 7️⃣ If admin login (admin using genToken1)
    if (decoded.adminId) {
      req.adminId = decoded.adminId;
      console.log("🛑 Authenticated admin:", req.adminId);
    }

    next();

  } catch (error) {
    console.log("❌ isAuth error:", error);
    return res.status(500).json({ message: `isAuth error: ${error.message}` });
  }
};

export default isAuth;