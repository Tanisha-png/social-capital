
import { io } from "../server.js";
import Message from "../models/Message.js";

// Get all messages between logged-in user and another user
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: req.params.recipientId },
                { sender: req.params.recipientId, recipient: req.user._id },
            ],
        }).populate("sender recipient", "firstName lastName email");

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { recipientId, text } = req.body;
        const senderId = req.user._id;

        // Save message in DB
        const message = new Message({
            sender: senderId,
            recipient: recipientId,
            text,
        });
        await message.save();

        // Notify recipient in real-time
        io.to(recipientId).emit("notification", {
            type: "message",
            message: `New message from ${req.user.firstName}`,
            messageId: message._id,
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: "Error sending message" });
    }
};

// Mark all messages from a conversation as read
export const markMessagesRead = async (req, res) => {
    try {
        const { otherUserId } = req.body;
        await Message.updateMany(
            {
                sender: otherUserId,
                recipient: req.user._id,
                read: false,
            },
            { $set: { read: true } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error marking messages as read" });
    }
};
