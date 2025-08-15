// import express from "express";
// import { sendFriendRequest, respondToRequest } from "../controllers/connectionController.js";
// // import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/:id/send-request", protect, sendFriendRequest);
// router.post("/:id/respond", protect, respondToRequest); // body { action: 'accept' | 'decline' }

// export default router;

// backend/routes/connectionRoutes.js
import express from "express";

const router = express.Router();

// Example: Add a connection
router.post("/", async (req, res) => {
    res.status(200).json({ message: "Add connection - implement logic" });
});

// Example: Get connections
router.get("/", async (req, res) => {
    res.status(200).json({ message: "Get connections - implement logic" });
});

export default router;

