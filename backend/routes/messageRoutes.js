
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import { getMessages, sendMessage, markMessagesRead } from "../controllers/messageController.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";


const router = express.Router();

router.get("/:recipientId", ensureLoggedIn, getMessages);
router.post("/:recipientId", ensureLoggedIn, sendMessage);
router.post("/mark-read", verifyToken, markMessagesRead);

// Fetch messages
router.get("/", ensureLoggedIn, (req, res) => {
    res.json([{ from: "user1", to: req.user.id, text: "Hello!" }]);
});

// Send a message
router.post("/", ensureLoggedIn, async (req, res) => {
    const { to, text } = req.body;
    if (!to || !text) return res.status(400).json({ message: "Recipient and text required" });

    // Create message (your existing logic)
    const message = { id: Date.now(), from: req.user.id, to, text };

    // 🔔 Create a notification for recipient
    if (to !== req.user.id) {
        const sender = await User.findById(req.user.id).select("firstName lastName");
        const notif = await Notification.create({
            user: to,
            type: "message",
            message: `${sender.firstName} ${sender.lastName} sent you a message.`,
            messageRef: message._id,
        });
        if (req.io) req.io.to(to.toString()).emit("notification", notif);
    }

    res.json(message);
});

export default router;


