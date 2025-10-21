

import Message from "../models/Message.js";
import User from "../models/User.js";

// 📩 Send a message
export const sendMessage = async (req, res) => {
    try {
        const sender = req.user._id;
        const { recipientId, content } = req.body;

        const message = await Message.create({
            sender,
            recipient: recipientId,
            text: content,
        });

        const populatedMessage = await message.populate([
            { path: "sender", select: "firstName lastName avatar" },
            { path: "recipient", select: "firstName lastName avatar" },
        ]);

        if (req.io) {
            req.io.to(recipientId).emit("newMessage", populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (err) {
        console.error("Error in sendMessage:", err);
        res.status(500).json({ message: "Server error sending message" });
    }
};

// 💬 Get all messages between two users
export const getMessagesWithUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { userId: otherUserId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("sender", "firstName lastName avatar")
            .populate("recipient", "firstName lastName avatar");

        res.json(messages);
    } catch (err) {
        console.error("Error in getMessagesWithUser:", err);
        res.status(500).json({ message: "Server error fetching messages" });
    }
};

// 🧭 Get user's recent conversations (sidebar)
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }],
        })
            .sort({ createdAt: -1 })
            .populate("sender", "firstName lastName avatar")
            .populate("recipient", "firstName lastName avatar");

        const conversations = [];
        const seen = new Set();

        for (const msg of messages) {
            const otherUser =
                msg.sender._id.toString() === userId.toString()
                    ? msg.recipient
                    : msg.sender;

            if (!seen.has(otherUser._id.toString())) {
                seen.add(otherUser._id.toString());
                conversations.push({ user: otherUser, lastMessage: msg });
            }
        }

        res.json(conversations);
    } catch (err) {
        console.error("Error in getConversations:", err);
        res.status(500).json({ message: "Server error fetching conversations" });
    }
};

// controllers/messageController.js
export const markMessagesRead = async (req, res) => {
    try {
        const { senderId } = req.body; // user whose messages we’re marking as read

        const updated = await Message.updateMany(
            { sender: senderId, recipient: req.user._id, read: false },
            { $set: { read: true } }
        );

        // Emit event to the sender so they see "Seen"
        if (req.io) {
            req.io.to(senderId.toString()).emit("messagesRead", {
                from: req.user._id, // who read them
            });
        }

        res.json({ success: true, updated });
    } catch (err) {
        console.error("Error marking messages as read:", err);
        res.status(500).json({ message: "Error marking messages as read" });
    }
};

