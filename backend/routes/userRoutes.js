// backend/routes/userRoutes.js
import express from "express";
import { getMe, updateMe, getConnections } from "../controllers/userController.js"; // ✅ import getConnections
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Get current user's profile
router.get("/me", checkToken, ensureLoggedIn, getMe);

// Update current user's profile (ownership check happens in controller)
router.put(
    "/me",
    checkToken,
    ensureLoggedIn,
    upload.single("avatarFile"), // field matches FormData.append("avatarFile", ...)
    updateMe
);

// Get any user's profile by ID (public info only)
router.get("/:id", checkToken, ensureLoggedIn, async (req, res) => {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// Get connections of a user
router.get("/:id/connections", checkToken, ensureLoggedIn, getConnections);

export default router;





