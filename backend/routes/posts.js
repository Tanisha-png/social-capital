

// backend/routes/posts.js
import express from "express";
import {
    getPosts,
    getPostById,
    createPost,
    deletePost,
    addReply,
    toggleLike,
} from "../controllers/posts.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();

// ✅ All post routes require valid token
router.use(checkToken);

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.post("/:id/replies", addReply);
router.post("/:id/like", toggleLike);

export default router;

