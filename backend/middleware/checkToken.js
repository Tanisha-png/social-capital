
// // backend/middleware/checkToken.js
// import jwt from "jsonwebtoken";

// const checkToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Use "id" because tokens are signed with { id: user._id }
//     req.user = { id: decoded.id, _id: decoded.id };

//     next();
//   } catch (err) {
//     console.error("❌ checkToken error:", err.message);
//     res.status(401).json({ message: "Token is not valid" });
//   }
// };

// export default checkToken;

// middleware/checkToken.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Fetch user from DB
    const user = await User.findById(decoded.id).select(
      "_id firstName lastName email avatar"
    );
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = {
      _id: user._id,          // ✅ always available for getMe
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default checkToken;
