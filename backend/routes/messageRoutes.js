
// import express from "express";
// import Message from "../models/Message.js";
// import { verifyToken } from "../middleware/authMiddleware.js";
// import {
//     sendMessage,
//     getMessagesWithUser,
//     getConversations,
//     markMessagesRead,
// } from "../controllers/messageController.js";

// const router = express.Router();

// router.get("/", verifyToken, getConversations);

// // GET unread message count for logged-in user
// router.get("/unread-count", verifyToken, async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const count = await Message.countDocuments({ recipient: userId, read: false });
//         res.json({ count });
//     } catch (err) {
//         res.status(500).json({ error: "Failed to fetch unread count" });
//     }
// });

// // 🔒 All routes now require valid JWT
// router.use(verifyToken);

// router.get("/:userId", getMessagesWithUser);
// router.post("/", sendMessage);
// router.post("/mark-read", markMessagesRead);



// export default router;

// import express from "express";
// import { verifyToken } from "../middleware/authMiddleware.js";
// import Message from "../models/Message.js";
// import {
//     sendMessage,
//     getMessagesWithUser,
//     getConversations,
//     markMessagesRead,
//     getUnreadMessageCount,
// } from "../controllers/messageController.js";

// const router = express.Router();

// // ✅ Protect all routes below
// router.use(verifyToken);

// router.get("/", getConversations);

// // ✅ Fix unread count route
// router.get("/unread-count", async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const count = await Message.countDocuments({ recipient: userId, read: false });
//         res.json({ count });
//     } catch (err) {
//         console.error("Unread count error:", err);
//         res.status(500).json({ error: "Failed to fetch unread count" });
//     }
// });

// router.get("/:userId", getMessagesWithUser);
// router.post("/", sendMessage);
// router.post("/mark-read", markMessagesRead);

// export default router;

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
