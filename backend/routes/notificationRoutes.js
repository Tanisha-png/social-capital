
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import checkToken from "../middleware/checkToken.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get notifications
router.get("/", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("fromUser", "firstName lastName avatar")
            .populate("post", "content");
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// Mark one as read
router.put("/:id/read", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: "Error updating notification" });
    }
});

export default router;
