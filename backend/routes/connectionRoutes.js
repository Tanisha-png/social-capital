
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
