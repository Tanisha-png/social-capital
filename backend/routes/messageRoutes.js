
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

// ✅ Protect all routes
router.use(checkToken, ensureLoggedIn);

router.get("/unread-count", getUnreadMessageCount);
router.get("/unread-counts", verifyToken, getUnreadCountsByUser);
router.get("/:userId", getMessagesWithUser);
router.post("/mark-read", verifyToken, markMessagesRead);
router.get("/", getConversations);
router.post("/", sendMessage);


export default router;
