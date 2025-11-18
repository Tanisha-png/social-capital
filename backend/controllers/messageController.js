import Notification from "../models/Notification.js";
import FriendRequest from "../models/FriendRequest.js";
import Message from "../models/message.js";
import User from "../models/user.js";

// Send message with duplicate prevention
export const sendMessage = async (req, res) => {
    try {
        const sender = req.user?._id;
        const { recipientId, text } = req.body;

        if (!sender) return res.status(401).json({ message: "Unauthorized" });
        if (!recipientId || !text) return res.status(400).json({ message: "recipientId and text are required" });

        // Prevent duplicates within 2 seconds
        const lastMessage = await Message.findOne({ sender, recipient: recipientId })
            .sort({ createdAt: -1 });

        if (lastMessage && lastMessage.text === text && (Date.now() - new Date(lastMessage.createdAt).getTime() < 2000)) {
            return res.status(400).json({ message: "Duplicate message detected" });
        }

        const message = await Message.create({
            sender,
            recipient: recipientId,
            text,
            read: false,
        });

        const populatedMessage = await message.populate([
            { path: "sender", select: "firstName lastName avatar" },
            { path: "recipient", select: "firstName lastName avatar" },
        ]);

        // Real-time emit
        if (req.io) {
            req.io.to(recipientId.toString()).emit("newMessage", {
                ...populatedMessage._doc,
                receiverId: recipientId.toString(),
            });
        }

        res.status(201).json(populatedMessage);

    } catch (err) {
        console.error("Error in sendMessage:", err);
        res.status(500).json({ message: "Server error sending message" });
    }
};

// Get messages with a user
export const getMessagesWithUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { userId: otherUserId } = req.params;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

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


export const getConversations = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // 1️⃣ Get all accepted friends
        const friendsRequests = await FriendRequest.find({
            $or: [
                { requester: userId, status: "accepted" },
                { recipient: userId, status: "accepted" },
            ],
        }).populate("requester recipient", "firstName lastName avatar");

        const friends = friendsRequests.map((fr) =>
            fr.requester._id.toString() === userId.toString() ? fr.recipient : fr.requester
        );

        // 2️⃣ Get all messages involving this user
        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }],
        })
            .sort({ createdAt: -1 })
            .populate("sender", "firstName lastName avatar")
            .populate("recipient", "firstName lastName avatar");

        const conversations = [];
        const seen = new Set();

        // 3️⃣ Add conversations from messages first
        for (const msg of messages) {
            const otherUser =
                msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;

            if (!seen.has(otherUser._id.toString())) {
                seen.add(otherUser._id.toString());
                conversations.push({ otherUser, lastMessage: msg });
            }
        }

        // 4️⃣ Add friends without messages
        for (const friend of friends) {
            if (!seen.has(friend._id.toString())) {
                seen.add(friend._id.toString());
                conversations.push({ otherUser: friend, lastMessage: null });
            }
        }

        return res.json(conversations);
    } catch (err) {
        console.error("Error in getConversations:", err);
        return res.status(500).json({ message: "Server error fetching conversations" });
    }
};


// Get unread count
export const getUnreadMessageCount = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const count = await Message.countDocuments({ recipient: userId, read: false });
        res.json({ count });
    } catch (err) {
        console.error("Error fetching unread count:", err);
        res.status(500).json({ message: "Server error fetching unread count" });
    }
};

export const markMessagesRead = async (req, res) => {
    try {
        const userId = req.user._id; // logged-in user
        const { senderId } = req.body; // optional

        const filter = senderId
            ? { sender: senderId, recipient: userId, read: false }
            : { recipient: userId, read: false };

        await Message.updateMany(filter, { read: true });

        res.json({ success: true });
    } catch (error) {
        console.error("Error marking messages read:", error);
        res.status(500).json({ error: "Failed to mark messages as read" });
    }
};

export const getUnreadCountsByUser = async (req, res) => {
    try {
        const userId = req.user._id;

        // Aggregate unread messages grouped by sender
        const unread = await Message.aggregate([
            { $match: { recipient: userId, read: false } },
            { $group: { _id: "$sender", count: { $sum: 1 } } }
        ]);

        res.json(unread);
    } catch (error) {
        console.error("Error fetching unread counts:", error);
        res.status(500).json({ error: "Failed to get unread counts" });
    }
};
