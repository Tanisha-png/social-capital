// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password"); // ⚡ Use decoded.id, not decoded.userId
        if (!user) return res.status(401).json({ message: "User not found" });

        req.user = { _id: decoded.id }; // attach full user object
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};


