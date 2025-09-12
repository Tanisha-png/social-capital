// models/Notification.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
        type: { type: String, enum: ["post_reply", "post_like", "message"], required: true },
        message: { type: String, required: true },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        messageRef: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
