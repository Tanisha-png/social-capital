
// backend/middleware/checkToken.js
import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header:", req.headers.authorization);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded user:", decoded);

    // Attach both id and _id for consistency
    req.user = { id: decoded.id, _id: decoded.id };

    next();
  } catch (err) {
    console.error("❌ checkToken error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default checkToken;

