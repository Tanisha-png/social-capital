
import express from "express";
import checkToken from "../middleware/checkToken.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import {
    getMessagesWithUser,
    sendMessage,
    markMessagesRead,
    getConversations,
    getUnreadMessageCount,
    getUnreadCountsByUser,
} from "../controllers/messageController.js";

const router = express.Router();

// 🔥 Apply ALL protection middleware (fix for Heroku)
router.use(checkToken, verifyToken, ensureLoggedIn);

// Unread counts
router.get("/unread-count", getUnreadMessageCount);
router.get("/unread-counts", getUnreadCountsByUser);

// Messages
router.get("/:userId", getMessagesWithUser);
router.post("/mark-read", markMessagesRead);

// Conversations list
router.get("/", getConversations);

// 🔥 This is the route that was broken
router.post("/", sendMessage);

export default router;
