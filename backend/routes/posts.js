// import express from "express";
// import checkToken from "../middleware/checkToken.js";
// import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
// import { getPosts, createPost } from "../controllers/posts.js";
// import { getPostById, toggleLike, addReply } from "../controllers/posts.js";
// import Post from "../models/post.js";

// const router = express.Router();


// // GET /api/posts/:id → fetch one post
// router.get("/:id", ensureLoggedIn, getPostById);
// router.get("/", checkToken, getPosts);

// // POST /api/posts/:id/like → toggle like/unlike
// router.post("/:id/like", ensureLoggedIn, toggleLike);

// // POST /api/posts/:id/reply → add reply
// router.post("/:id/reply", ensureLoggedIn, addReply);

// // Create post
// router.post("/", checkToken, ensureLoggedIn, async (req, res) => {
//     try {
//         const post = new Post({
//             user: req.user.id,
//             content: req.body.content,
//         });
//         const savedPost = await post.save();
//         res.status(201).json(savedPost);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // Get all posts
// router.get("/", checkToken, ensureLoggedIn, async (req, res) => {
//     try {
//         const posts = await Post.find().populate("user", "name");
//         res.json(posts);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // Update post (only owner)
// router.put("/:id", checkToken, ensureLoggedIn, async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         if (post.user.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Not authorized to update this post" });
//         }

//         post.content = req.body.content || post.content;
//         const updatedPost = await post.save();
//         res.json(updatedPost);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // Delete post (only owner)
// router.delete("/:id", checkToken, ensureLoggedIn, async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         if (!post) return res.status(404).json({ message: "Post not found" });

//         if (post.user.toString() !== req.user.id) {
//             return res.status(403).json({ message: "Not authorized to delete this post" });
//         }

//         await post.deleteOne();
//         res.json({ message: "Post deleted successfully" });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

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

