
import express from "express";
import {
    getMe, updateMe, getConnections, searchUsers, sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    } from "../controllers/userController.js";
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import upload from "../middleware/upload.js";
import User from "../models/user.js";


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

// Search users
router.get("/search", checkToken, ensureLoggedIn, searchUsers);

// Get any user's profile
router.get("/:id", checkToken, ensureLoggedIn, async (req, res) => {
    const User = (await import("../models/user.js")).default;
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

// ✅ Get all users (for messaging/friend search)
router.get("/", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const users = await User.find({}, "firstName lastName email avatar");
        res.json(users);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});


// Friend request system
router.post("/:userId/request", checkToken, ensureLoggedIn, sendFriendRequest);
router.get("/me/requests", checkToken, ensureLoggedIn, getFriendRequests);
router.post("/:userId/accept", checkToken, ensureLoggedIn, acceptFriendRequest);
router.post("/:userId/decline", checkToken, ensureLoggedIn, declineFriendRequest);
router.post("/friends/remove", checkToken, removeFriend);

export default router;
