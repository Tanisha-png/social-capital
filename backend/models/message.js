import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    read: { type: Boolean, default: false },
}, { timestamps: true }); // ✅ ensures createdAt/updatedAt

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
