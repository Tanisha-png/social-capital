import Message from "../models/Message.js";

export const saveMessage = async (req, res) => {
    const { sender, receiver, content } = req.body;
    if (!sender || !receiver || !content) return res.status(400).json({ message: "Missing fields" });
    const msg = await Message.create({ sender, receiver, content });
    res.status(201).json(msg);
};

export const getConversation = async (req, res) => {
    const { userId, otherId } = req.query; // e.g., /api/messages?userId=...&otherId=...
    if (!userId || !otherId) return res.status(400).json({ message: "Missing query params" });
    const messages = await Message.find({
        $or: [
            { sender: userId, receiver: otherId },
            { sender: otherId, receiver: userId }
        ]
    }).sort({ createdAt: 1 });
    res.json(messages);
};
