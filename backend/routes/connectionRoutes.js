// import express from "express";
// import { sendFriendRequest, respondToRequest } from "../controllers/connectionController.js";
// // import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/:id/send-request", protect, sendFriendRequest);
// router.post("/:id/respond", protect, respondToRequest); // body { action: 'accept' | 'decline' }

// export default router;

// // backend/routes/connectionRoutes.js
// import express from "express";
// import { sendFriendRequest, respondToRequest, getConnections } from "../controllers/connectionController.js";
// import checkToken from "../middleware/checkToken.js";
// import ensureLoggedIn from "../middleware/ensureLoggedIn.js";

// const router = express.Router();

// router.post("/:id/send-request", checkToken, ensureLoggedIn, sendFriendRequest);
// router.post("/:id/respond", checkToken, ensureLoggedIn, respondToRequest);
// router.get("/", checkToken, ensureLoggedIn, getConnections);


// // Example: Add a connection
// router.post("/", async (req, res) => {
//     res.status(200).json({ message: "Add connection - implement logic" });
// });

// // Example: Get connections
// router.get("/", async (req, res) => {
//     res.status(200).json({ message: "Get connections - implement logic" });
// });

// export default router;

import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js"; 
import {
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    listFriends,
} from "../controllers/friendController.js"; // ✅ fixed

const router = express.Router();

router.post("/request", ensureLoggedIn, sendFriendRequest);
router.post("/accept", ensureLoggedIn, acceptFriendRequest);
router.post("/decline", ensureLoggedIn, declineFriendRequest);
router.delete("/remove", ensureLoggedIn, removeFriend);
router.get("/", listFriends);

// Send friend request
router.post("/request/:userId", ensureLoggedIn, (req, res) => {
    res.json({ message: `Friend request sent to ${req.params.userId}` });
});

// Accept friend request
router.post("/accept/:userId", ensureLoggedIn, (req, res) => {
    res.json({ message: `Friend request from ${req.params.userId} accepted` });
});

// Decline friend request
router.post("/decline/:userId", ensureLoggedIn, (req, res) => {
    res.json({ message: `Friend request from ${req.params.userId} declined` });
});

// Remove friend
router.delete("/:userId", ensureLoggedIn, (req, res) => {
    res.json({ message: `Removed ${req.params.userId} from friends list` });
});


export default router;
