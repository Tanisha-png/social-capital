
// middleware/checkToken.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) return res.status(401).json({ message: "Invalid token payload" });

    const user = await User.findById(decoded.id).select("_id firstName lastName email avatar");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkToken;
