// routes/notificationRoutes.js
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import Notification from "../models/Notification.js";
import checkToken from "../middleware/checkToken.js";
import {
    getNotifications,
    getNotificationCounts,
    markAllNotificationsRead,
} from "../controllers/notifications.js";


const router = express.Router();

router.get("/", checkToken, ensureLoggedIn, getNotifications);
router.get("/counts", checkToken, ensureLoggedIn, getNotificationCounts);
router.post("/read-all", checkToken, ensureLoggedIn, markAllNotificationsRead);

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

// ✅ Get unread counts (for bell + envelope)
router.get("/counts", ensureLoggedIn, async (req, res) => {
    try {
        const [postCount, messageCount] = await Promise.all([
            Notification.countDocuments({ user: req.user._id, read: false, type: { $in: ["post_like", "post_reply"] } }),
            Notification.countDocuments({ user: req.user._id, read: false, type: "message" }),
        ]);
        res.json({ postCount, messageCount });
    } catch (err) {
        res.status(500).json({ message: "Error fetching counts" });
    }
});

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

// Mark a single notification as read
router.put("/:id/read", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: "Notification not found" });

        // Only allow the owner to mark their notifications
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (err) {
        console.error("Error marking notification as read:", err);
        res.status(500).json({ message: "Server error" });
    }
});


export default router;

// routes/notificationRoutes.js
// import express from "express";
// import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
// import checkToken from "../middleware/checkToken.js";
// import {
//     getNotifications,
//     getNotificationCounts,
//     markAllNotificationsRead,
// } from "../controllers/notifications.js";

// const router = express.Router();

// // ✅ Get all notifications
// router.get("/", checkToken, ensureLoggedIn, getNotifications);

// // ✅ Get unread counts (for bell + envelope badges)
// router.get("/counts", checkToken, ensureLoggedIn, getNotificationCounts);

// // ✅ Mark ALL as read
// router.put("/read-all", checkToken, ensureLoggedIn, markAllNotificationsRead);

// export default router;
