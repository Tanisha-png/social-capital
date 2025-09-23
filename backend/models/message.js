import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ match controller
    text: { type: String, required: true }, // ✅ match controller
    read: { type: Boolean, default: false }, // ✅ new field for unread tracking
    createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
