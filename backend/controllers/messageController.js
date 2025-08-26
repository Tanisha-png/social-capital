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

// import Message from "../models/message.js";

// // Save a message
// export const saveMessage = async (req, res) => {
//     try {
//         const { to, text } = req.body;
//         const message = await Message.create({
//             from: req.user._id,
//             to,
//             text,
//         });
//         res.status(201).json(message);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // Get conversation between two users
// export const getConversation = async (req, res) => {
//     try {
//         const { userId, otherId } = req.query;
//         const messages = await Message.find({
//             $or: [
//                 { from: userId, to: otherId },
//                 { from: otherId, to: userId },
//             ],
//         }).sort({ createdAt: 1 });

//         res.status(200).json(messages);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// import Message from "../models/message.js";

// // POST /api/messages
// // body: { receiver: ObjectId, content: string }
// export const saveMessage = async (req, res) => {
//     try {
//         const sender = req.user.id; // set by checkToken
//         const { receiver, content } = req.body;

//         if (!receiver || !content) {
//             return res.status(400).json({ message: "receiver and content are required" });
//         }

//         if (receiver === sender) {
//             return res.status(400).json({ message: "Cannot message yourself" });
//         }

//         const msg = await Message.create({ sender, receiver, content });
//         res.status(201).json(msg);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

// // GET /api/messages?userId=<otherUserId>
// // returns the conversation between req.user.id and userId
// export const getConversation = async (req, res) => {
//     try {
//         const me = req.user.id;
//         const { userId } = req.query;
//         if (!userId) return res.status(400).json({ message: "userId is required" });

//         const messages = await Message.find({
//             $or: [
//                 { sender: me, receiver: userId },
//                 { sender: userId, receiver: me },
//             ],
//         }).sort({ createdAt: 1 });

//         res.json(messages);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: req.params.recipientId },
                { sender: req.params.recipientId, recipient: req.user._id },
            ],
        }).populate("sender recipient", "name email");

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: "Error fetching messages" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const msg = new Message({
            sender: req.user._id,
            recipient: req.params.recipientId,
            text: req.body.text,
        });
        await msg.save();
        res.json(msg);
    } catch (err) {
        res.status(500).json({ message: "Error sending message" });
    }
};
