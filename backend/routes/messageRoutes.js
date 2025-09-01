
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.get("/:recipientId", ensureLoggedIn, getMessages);
router.post("/:recipientId", ensureLoggedIn, sendMessage);

// Fetch messages
router.get("/", ensureLoggedIn, (req, res) => {
    res.json([{ from: "user1", to: req.user.id, text: "Hello!" }]);
});

// Send a message
router.post("/", ensureLoggedIn, (req, res) => {
    const { to, text } = req.body;
    res.json({ id: Date.now(), from: req.user.id, to, text });
});

export default router;


