// import express from "express";
// import { saveMessage, getConversation } from "../controllers/messageController.js";
// // import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/", protect, saveMessage);
// router.get("/", protect, getConversation);

// export default router;

// backend/routes/messageRoutes.js
import express from "express";
import { saveMessage, getConversation } from "../controllers/messageController.js";
import checkToken from "../middleware/checkToken.js";
import ensureLoggedIn from "../middleware/ensureLoggedIn.js";

const router = express.Router();

router.post("/", checkToken, ensureLoggedIn, saveMessage);
router.get("/", checkToken, ensureLoggedIn, getConversation);

// Example: Send a message
router.post("/", async (req, res) => {
    res.status(200).json({ message: "Send message - implement logic" });
});

// Example: Get messages
router.get("/", async (req, res) => {
    res.status(200).json({ message: "Get messages - implement logic" });
});

export default router;
