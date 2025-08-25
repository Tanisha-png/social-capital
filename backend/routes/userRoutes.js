// import express from "express";
// import { getUserProfile, updateUserProfile } from "../controllers/userController.js";
// // import { protect } from "../middleware/authMiddleware.js";
// import { getFriendList } from '../controllers/userController.js';
// // import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();
// router.get('/friends', protect, getFriendList);

// router.get("/:id", protect, getUserProfile);
// router.put("/", protect, updateUserProfile); // update current user

// export default router;

// backend/routes/userRoutes.js
import express from "express";
import { 
    getUserProfile, 
    updateUserProfile, 
    getFriendList, 
    searchUsers, 
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    declineFriendRequest,
    getFriends,
    removeFriend,
} from "../controllers/userController.js";

import checkToken from "../middleware/checkToken.js";
import ensureLoggedIn from "../middleware/ensureLoggedIn.js";

const router = express.Router();

router.get("/search", checkToken, ensureLoggedIn, searchUsers);
router.get("/:id", checkToken, ensureLoggedIn, getUserProfile);
router.put("/", checkToken, ensureLoggedIn, updateUserProfile);
router.get("/friends", checkToken, ensureLoggedIn, getFriendList, getFriends);
router.post("/friends/remove", checkToken, ensureLoggedIn, removeFriend);
router.post("/friend-request", checkToken, ensureLoggedIn, sendFriendRequest);
router.get("/friend-requests", checkToken, ensureLoggedIn, getFriendRequests);
router.post("/friend-requests/accept", checkToken, ensureLoggedIn, acceptFriendRequest);
router.post("/friend-requests/decline", checkToken, ensureLoggedIn, declineFriendRequest);

// Example: GET all users
router.get("/", async (req, res) => {
    try {
        res.status(200).json({ message: "List of users - implement logic" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Example: GET single user
router.get("/:id", async (req, res) => {
    try {
        res.status(200).json({ message: `User ${req.params.id} - implement logic` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;

