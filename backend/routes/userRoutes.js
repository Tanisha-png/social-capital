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

const router = express.Router();

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

