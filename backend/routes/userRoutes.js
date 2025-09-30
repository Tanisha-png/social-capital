
import express from "express";
import { getMe, updateMe, getConnections } from "../controllers/userController.js";
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Current user profile
router.get("/me", checkToken, ensureLoggedIn, getMe);

// Update current user profile
router.put(
    "/me",
    checkToken,
    ensureLoggedIn,
    upload.single("avatarFile"),
    updateMe
);

// Get any user's profile
router.get("/:id", checkToken, ensureLoggedIn, async (req, res) => {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

// Connections route (works for /me/connections and /:id/connections)
router.get(
    ["/me/connections", "/:id/connections"],
    checkToken,
    ensureLoggedIn,
    getConnections
);

export default router;
