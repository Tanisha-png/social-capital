

// backend/routes/userRoutes.js
import express from "express";
import { getMe, updateMe } from "../controllers/userController.js";
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import upload from "../middleware/upload.js";
import User from "../models/User.js"; // ✅ FIX: import User model

const router = express.Router();

// Get current user's profile
router.get("/me", checkToken, ensureLoggedIn, getMe);

// Update current user's profile (ownership check happens in controller)
router.put(
    "/me",
    checkToken,
    ensureLoggedIn,
    upload.single("avatarFile"), // ✅ field name matches FormData.append("avatarFile", ...)
    updateMe
);

// Get any user's profile by ID (public info only)
router.get("/:id", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ error: "Failed to fetch user profile" });
    }
});

export default router;




