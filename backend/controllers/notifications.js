import Notification from "../models/Notification.js";
import { io } from "../server.js";
import nodemailer from "nodemailer";

// export async function notifyUser({ userId, fromUserId, type, message, post, messageRef }) {
//     const notif = await Notification.create({
//         user: userId,            // recipient
//         fromUser: fromUserId,    // who triggered notification
//         type,
//         message,
//         post,
//         messageRef,
//     });

//     io.to(userId.toString()).emit("notification", notif);
// }

export async function notifyUser({ userId, fromUserId, type, message, post, messageRef }) {
    let notif = await Notification.create({
        user: userId,
        fromUser: fromUserId,
        type,
        message,
        post,
        messageRef,
    });

    // Populate fromUser for frontend
    notif = await notif.populate("fromUser", "firstName lastName _id");

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
// export async function createNotification({
//     userId,
//     type,
//     message,
//     postId = null,
//     messageId = null,
// }) {
//     try {
//         const notification = new Notification({
//             user: userId,
//             type,
//             message,
//             post: postId,
//             messageRef: messageId,
//         });
//         await notification.save();

//         // ✅ Emit socket event (real-time)
//         if (io) {
//             io.to(userId.toString()).emit("notification", notification);
//         }

//         return notification;
//     } catch (err) {
//         console.error("Notification save error:", err);
//     }
// }

export async function createNotification({
    userId,
    fromUserId,   // <--- add this
    type,
    message,
    postId = null,
    messageId = null,
}) {
    try {
        const notification = new Notification({
            user: userId,
            fromUser: fromUserId || null,   // <--- include it
            type,
            message,
            post: postId,
            messageRef: messageId,
        });

        await notification.save();

        if (io) {
            io.to(userId.toString()).emit("notification", notification);
        }

        return notification;
    } catch (err) {
        console.error("Notification save error:", err);
    }
}


export const markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: "Error marking notifications as read" });
    }
};

// --- GET all notifications for logged-in user ---
// export const getNotifications = async (req, res) => {
//     try {
//         const notifications = await Notification.find({ user: req.user._id })
//             .sort({ createdAt: -1 })
//             .populate("post", "content")
//             .populate("messageRef", "content");

//         res.json(notifications);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching notifications" });
//     }
// };

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("fromUser", "firstName lastName _id")
            .populate("post", "content")
            .populate("messageRef", "content");

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notifications" });
    }
};

// --- GET counts for navbar badges ---
export const getNotificationCounts = async (req, res) => {
    try {
        const postCount = await Notification.countDocuments({
            user: req.user._id,
            type: { $in: ["post_reply", "post_like"] },
            read: false,
        });

        const messageCount = await Notification.countDocuments({
            user: req.user._id,
            type: "message",
            read: false,
        });

        res.json({ postCount, messageCount });
    } catch (err) {
        res.status(500).json({ message: "Error fetching counts" });
    }
};
