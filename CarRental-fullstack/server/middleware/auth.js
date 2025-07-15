import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    // Check if the request has an authorization header
    // This header is expected to contain the JWT token for authentication8
    const token = req.headers.authorization;
    
    if(!token){
        return res.json({success: false, message: "not authorized"})
    }
    try {
        const userId = jwt.decode(token, process.env.JWT_SECRET)

        if(!userId){
            return res.json({success: false, message: "not authorized"})
        }
        // Find the user by ID and exclude the password field from the result
        // This is to ensure that the password is not sent back to the client
        req.user = await User.findById(userId).select("-password")
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}