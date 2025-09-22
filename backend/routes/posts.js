
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import Notification from "../models/Notification.js";
import checkToken from "../middleware/checkToken.js";
import Post from "../models/post.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ GET all posts
router.get("/", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("author", "firstName lastName avatar")
            .populate("replies.author", "firstName lastName avatar");
        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ CREATE a post
router.post("/", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("firstName lastName avatar");
        if (!user) return res.status(404).json({ message: "User not found" });

        const post = new Post({
            content: req.body.content,
            author: user._id,
        });

        await post.save();
        await post.populate("author", "firstName lastName avatar");

        res.status(201).json(post);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ LIKE / UNLIKE a post
router.put("/:id/like", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author");
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user.id;

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);

            if (post.author._id.toString() !== userId.toString()) {
                const liker = await User.findById(userId).select("firstName lastName");
                const notif = await Notification.create({
                    user: post.author._id,
                    type: "post_like",
                    message: `${liker.firstName} ${liker.lastName} liked your post.`,
                    post: post._id,
                });
                if (req.io) req.io.to(post.author._id.toString()).emit("notification", notif);
            }
        }

        await post.save();

        // ✅ Re-fetch the post with populated fields for response
        const populatedPost = await Post.findById(post._id)
            .populate("author", "firstName lastName avatar")
            .populate("replies.author", "firstName lastName avatar");

        res.json(populatedPost);
    } catch (err) {
        console.error("Error liking post:", err);
        res.status(500).json({ message: "Server error" });
    }
});
// ✅ ADD a reply
router.post("/:id/replies", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Reply text is required" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const reply = { author: req.user.id, text };
        post.replies.push(reply);
        await post.save();
        await post.populate("replies.author", "firstName lastName avatar");

        res.json(post.replies[post.replies.length - 1]);
    } catch (err) {
        console.error("Error replying:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ SHARE a post
router.post("/:id/share", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const originalPost = await Post.findById(req.params.id)
            .populate("author", "firstName lastName avatar")
            .populate("replies.author", "firstName lastName avatar");

        if (!originalPost) {
            return res.status(404).json({ message: "Original post not found" });
        }

        const user = await User.findById(req.user.id).select("firstName lastName avatar");
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Allow empty content for shared posts
        const newPost = new Post({
            content: req.body.content?.trim() || "", // empty string allowed for shared posts
            author: user._id,
            sharedFrom: originalPost._id,
        });

        await newPost.save();

        // ✅ Populate author of new post
        await newPost.populate("author", "firstName lastName avatar");

        // ✅ Populate sharedFrom with original post's author and replies
        await newPost.populate({
            path: "sharedFrom",
            populate: [
                { path: "author", select: "firstName lastName avatar" },
                { path: "replies.author", select: "firstName lastName avatar" },
            ],
        });

        // ✅ Ensure new post's own replies (likely empty) are populated
        await newPost.populate("replies.author", "firstName lastName avatar");

        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error sharing post:", err);
        res.status(500).json({ message: "Server error" });
    }
});




export default router;
