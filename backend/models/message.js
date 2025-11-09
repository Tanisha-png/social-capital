import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     text: String,
//     read: { type: Boolean, default: false },
// }, { timestamps: true }); // ✅ ensures createdAt/updatedAt

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false }, // ✅ ADD THIS LINE
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
