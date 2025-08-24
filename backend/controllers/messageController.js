// import Message from "../models/Message.js";

// export const saveMessage = async (req, res) => {
//     const { sender, receiver, content } = req.body;
//     if (!sender || !receiver || !content) return res.status(400).json({ message: "Missing fields" });
//     const msg = await Message.create({ sender, receiver, content });
//     res.status(201).json(msg);
// };

// export const getConversation = async (req, res) => {
//     const { userId, otherId } = req.query; // e.g., /api/messages?userId=...&otherId=...
//     if (!userId || !otherId) return res.status(400).json({ message: "Missing query params" });
//     const messages = await Message.find({
//         $or: [
//             { sender: userId, receiver: otherId },
//             { sender: otherId, receiver: userId }
//         ]
//     }).sort({ createdAt: 1 });
//     res.json(messages);
// };

import Message from "../models/message.js";

// Save a message
export const saveMessage = async (req, res) => {
    try {
        const { to, text } = req.body;
        const message = await Message.create({
            from: req.user._id,
            to,
            text,
        });
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get conversation between two users
export const getConversation = async (req, res) => {
    try {
        const { userId, otherId } = req.query;
        const messages = await Message.find({
            $or: [
                { from: userId, to: otherId },
                { from: otherId, to: userId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

