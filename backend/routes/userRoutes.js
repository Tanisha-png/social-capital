
// import express from "express";
// import checkToken from "../middleware/checkToken.js";
// import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
// import {
//     getMe,
//     updateMe,
//     searchUsers,
//     getFriendList,
// } from "../controllers/userController.js";

// const router = express.Router();

// // userRoutes.js
// router.put("/:id", checkToken, async (req, res) => {
//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         res.json(updatedUser);
//     } catch (err) {
//         console.error("Error updating user:", err);
//         res.status(500).json({ error: "Failed to update profile" });
//     }
// });

// // Current user profile
// router.get("/me", checkToken, ensureLoggedIn, getMe);
// router.put("/me", checkToken, ensureLoggedIn, updateMe);

// // Search users (by name/email), excludes passwords
// router.get("/search", ensureLoggedIn, searchUsers);

// // Friends list
// router.get("/friends", checkToken, ensureLoggedIn, getFriendList);

// export default router;

import express from "express";
import { getMe, updateMe } from "../controllers/userController.js";
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";

const router = express.Router();

// Get current user's profile
router.get("/me", checkToken, ensureLoggedIn, getMe);

// Update current user's profile (ownership check happens in controller)
router.put("/me", checkToken, ensureLoggedIn, updateMe);

// Get any user's profile by ID (public info only)
router.get("/:id", checkToken, ensureLoggedIn, async (req, res) => {
    const user = await user.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

export default router;



