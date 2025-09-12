import Notification from "../models/Notification.js";
import { io } from "../server.js";
import nodemailer from "nodemailer";

export async function notifyUser({ userId, type, message, post, messageRef }) {
    const notif = await Notification.create({
        user: userId,
        type,
        message,
        post,
        messageRef,
    });

    io.to(userId.toString()).emit("notification", notif);
}

// --- EMAIL TRANSPORTER ---
const transporter = nodemailer.createTransport({
    service: "Gmail", // Or use Outlook/SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// --- SEND EMAIL ---
export async function sendEmail(to, subject, message) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: message,
        });
    } catch (err) {
        console.error("Email error:", err);
    }
}

// --- IN-APP NOTIFICATION ---
export async function createNotification({
    userId,
    type,
    message,
    postId = null,
    messageId = null,
}) {
    try {
        const notification = new Notification({
            user: userId,
            type,
            message,
            post: postId,
            messageRef: messageId,
        });
        await notification.save();
        return notification;
    } catch (err) {
        console.error("Notification save error:", err);
    }
}
