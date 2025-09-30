
// import express from "express";
// import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
// import { getMessages, sendMessage, markMessagesRead } from "../controllers/messageController.js";
// import Notification from "../models/Notification.js";
// import User from "../models/User.js";


// const router = express.Router();

// router.get("/:recipientId", ensureLoggedIn, getMessages);
// router.post("/:recipientId", ensureLoggedIn, sendMessage);
// router.post("/mark-read", verifyToken, markMessagesRead);

// // Fetch messages
// router.get("/", ensureLoggedIn, (req, res) => {
//     res.json([{ from: "user1", to: req.user.id, text: "Hello!" }]);
// });

// // Send a message
// router.post("/", ensureLoggedIn, async (req, res) => {
//     const { to, text } = req.body;
//     if (!to || !text) return res.status(400).json({ message: "Recipient and text required" });

//     // Create message (your existing logic)
//     const message = { id: Date.now(), from: req.user.id, to, text };

//     // 🔔 Create a notification for recipient
//     if (to !== req.user.id) {
//         const sender = await User.findById(req.user.id).select("firstName lastName");
//         const notif = await Notification.create({
//             user: to,
//             type: "message",
//             message: `${sender.firstName} ${sender.lastName} sent you a message.`,
//             messageRef: message._id,
//         });
//         if (req.io) req.io.to(to.toString()).emit("notification", notif);
//     }

//     res.json(message);
// });

// export default router;

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



