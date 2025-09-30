
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import { markMessagesRead } from "../controllers/messageController.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

const router = express.Router();

// ✅ Get conversation with a specific recipient
router.get("/:recipientId", ensureLoggedIn, async (req, res) => {
    try {
        const { recipientId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: recipientId },
                { sender: recipientId, recipient: req.user._id },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("sender", "firstName lastName")
            .populate("recipient", "firstName lastName");

        res.json(messages);
    } catch (err) {
        console.error("Error fetching conversation:", err);
        res.status(500).json({ message: "Error fetching conversation" });
    }
});

// ✅ Fetch recent messages for dropdown + unread count
router.get("/", ensureLoggedIn, async (req, res) => {
    try {
        const messages = await Message.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("sender", "firstName lastName");

        const unreadCount = await Message.countDocuments({
            recipient: req.user._id,
            read: false,
        });

        res.json({ messages, unreadCount });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Error fetching messages" });
    }
});

// ✅ Send a new message
router.post("/", ensureLoggedIn, async (req, res) => {
    const { recipient, text } = req.body;
    if (!recipient || !text) {
        return res.status(400).json({ message: "Recipient and text required" });
    }

    try {
        const message = await Message.create({
            sender: req.user._id,
            recipient,
            text,
        });

        // 🔔 Create a notification for recipient
        if (recipient.toString() !== req.user._id.toString()) {
            const sender = await User.findById(req.user._id).select("firstName lastName");
            const notif = await Notification.create({
                user: recipient,
                type: "message",
                message: `${sender.firstName} ${sender.lastName} sent you a message.`,
                messageRef: message._id,
            });

            if (req.io) {
                req.io.to(recipient.toString()).emit("notification", notif);
                req.io.to(recipient.toString()).emit("newMessage", message);
            }
        }

        res.json(message);
    } catch (err) {
        console.error("Error sending message:", err);
        res.status(500).json({ message: "Error sending message" });
    }
});

// ✅ Mark messages as read
router.post("/mark-read", ensureLoggedIn, markMessagesRead);

export default router;



