

import express from "express";
import { getMe, updateMe } from "../controllers/userController.js";
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";

const router = express.Router();

// Get current user's profile
router.get("/me", checkToken, ensureLoggedIn, getMe);

// Update current user's profile (ownership check happens in controller)
router.put("/me", checkToken, ensureLoggedIn, updateMe);

// Get any user's profile by ID (public info only)
router.get("/:id", checkToken, ensureLoggedIn, async (req, res) => {
    const user = await user.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

export default router;



