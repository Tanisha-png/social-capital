

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
