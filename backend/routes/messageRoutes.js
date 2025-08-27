// import express from "express";
// import { saveMessage, getConversation } from "../controllers/messageController.js";
// // import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/", protect, saveMessage);
// router.get("/", protect, getConversation);

// export default router;

// backend/routes/messageRoutes.js
// import express from "express";
// import { saveMessage, getConversation } from "../controllers/messageController.js";
// import checkToken from "../middleware/checkToken.js";
// import ensureLoggedIn from "../middleware/ensureLoggedIn.js";

// const router = express.Router();

// router.post("/", checkToken, ensureLoggedIn, saveMessage);
// router.get("/", checkToken, ensureLoggedIn, getConversation);

// // Example: Send a message
// router.post("/", async (req, res) => {
//     res.status(200).json({ message: "Send message - implement logic" });
// });

// // Example: Get messages
// router.get("/", async (req, res) => {
//     res.status(200).json({ message: "Get messages - implement logic" });
// });

// export default router;

// import express from "express";
// import { saveMessage, getConversation } from "../controllers/messageController.js";
// import checkToken from "../middleware/checkToken.js";
// import ensureLoggedIn from "../middleware/ensureLoggedIn.js";

// const router = express.Router();

// // Authenticated only
// router.post("/", checkToken, ensureLoggedIn, saveMessage);
// router.get("/", checkToken, ensureLoggedIn, getConversation);

// export default router;

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


