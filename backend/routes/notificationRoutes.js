// routes/notificationRoutes.js
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get all notifications
router.get("/", ensureLoggedIn, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("post", "content")
            .populate("messageRef", "content");
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// Mark notification as read
// router.put("/:id/read", ensureLoggedIn, async (req, res) => {
//     try {
//         const notification = await Notification.findById(req.params.id);
//         if (!notification) return res.status(404).json({ message: "Not found" });

//         if (notification.user.toString() !== req.user._id.toString()) {
//             return res.status(403).json({ message: "Not authorized" });
//         }

//         notification.read = true;
//         await notification.save();
//         res.json(notification);
//     } catch (err) {
//         res.status(500).json({ message: "Error updating notification" });
//     }
// });

// ✅ Mark ALL as read
router.put("/read-all", ensureLoggedIn, async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        res.status(500).json({ message: "Error marking all read" });
    }
});

export default router;
