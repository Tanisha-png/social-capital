// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        // Expect token in Authorization header: "Bearer <token>"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user ID to request
        req.user = { id: decoded.id };

        console.log("✅ verifyToken success, user ID:", decoded.id); // Debug log
        next();
    } catch (err) {
        console.error("❌ verifyToken error:", err.message);
        return res.status(401).json({ message: "Token is not valid" });
    }
};

