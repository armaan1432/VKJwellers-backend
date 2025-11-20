// ============================================
// FILE 3: config/token.js (NO CHANGES NEEDED)
// ============================================
import jwt from "jsonwebtoken"

export const genToken = async (userId) => {
   try {
    let token = await jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn:"7d"})
    return token
   } catch (error) {
     console.log("token error")
   }
}

export const genToken1 = async (email) => {
   try {
    let token = await jwt.sign({adminId: email} , process.env.JWT_SECRET , {expiresIn:"7d"})
    return token
   } catch (error) {
     console.log("token error")
   }
}