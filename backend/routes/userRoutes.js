
import express from "express";
import checkToken from "../middleware/checkToken.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import {
    getMe,
    updateMe,
    searchUsers,
    getFriendList,
} from "../controllers/userController.js";

const router = express.Router();

// Current user profile
router.get("/me", checkToken, ensureLoggedIn, getMe);
router.put("/me", checkToken, ensureLoggedIn, updateMe);

// Search users (by name/email), excludes passwords
router.get("/search", ensureLoggedIn, searchUsers);

// Friends list
router.get("/friends", checkToken, ensureLoggedIn, getFriendList);

export default router;


