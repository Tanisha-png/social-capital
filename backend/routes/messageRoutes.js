
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    sendMessage,
    getMessagesWithUser,
    getConversations,
    markMessagesRead,
} from "../controllers/messageController.js";

const router = express.Router();

// 🔒 All routes now require valid JWT
router.use(verifyToken);

router.get("/", getConversations);
router.get("/:userId", getMessagesWithUser);
router.post("/", sendMessage);
router.post("/mark-read", markMessagesRead);

export default router;
