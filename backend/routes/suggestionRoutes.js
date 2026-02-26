import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import { getMutualFriendSuggestions } from "../controllers/suggestionController.js";

const router = express.Router();

router.get(
    "/",
    verifyToken,
    ensureLoggedIn,
    getMutualFriendSuggestions
);

export default router;