
import express from "express";
import { ensureLoggedIn } from "../middleware/ensureLoggedIn.js";
import checkToken from "../middleware/checkToken.js";
import Notification from "../models/Notification.js";
import Post from "../models/post.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ GET all posts
router.get("/", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("author", "firstName lastName avatar")
        .populate("replies.author", "firstName lastName avatar")
        .populate({
            path: "sharedFrom",
            populate: [
            { path: "author", select: "firstName lastName avatar" },
            { path: "replies.author", select: "firstName lastName avatar" },
            ],
        });

        res.json(posts);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Server error" });
    }
    });

// GET /api/posts/:id
router.get("/:id", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "firstName lastName avatar")
            .populate("replies.author", "firstName lastName avatar")
            .populate("likes", "firstName lastName avatar") // ✅ include likes
            .populate({
                path: "sharedFrom",
                populate: [
                    { path: "author", select: "firstName lastName avatar" },
                    { path: "replies.author", select: "firstName lastName avatar" },
                ],
            });

        if (!post) return res.status(404).json({ message: "Post not found" });

        res.json(post);
    } catch (err) {
        console.error("Error fetching single post:", err);
        res.status(500).json({ message: "Server error" });
    }
});


    // ✅ CREATE a post
    router.post("/", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("firstName lastName avatar");
        if (!user) return res.status(404).json({ message: "User not found" });

        const newPost = new Post({
        content: req.body.content,
        author: user._id,
        });

        await newPost.save();
        await newPost.populate("author", "firstName lastName avatar");

        res.status(201).json(newPost);
    } catch (err) {
        console.error("Error creating post:", err);
        res.status(500).json({ message: "Server error" });
    }
    });

    // ✅ LIKE / UNLIKE a post
    router.put("/:id/like", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author");
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userId = req.user._id;

        if (post.likes.includes(userId)) {
        // unlike
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        } else {
        // like
        post.likes.push(userId);

        if (post.author._id.toString() !== userId.toString()) {
            const liker = await User.findById(userId).select("firstName lastName");
            const notif = await Notification.create({
            user: post.author._id,
            type: "post_like",
            message: `${ liker.firstName } ${ liker.lastName } liked your post.`,
            post: post._id,
            });
            if (req.io) req.io.to(post.author._id.toString()).emit("notification", notif);
        }
        }

        await post.save();

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

        const post = await Post.findById(req.params.id).populate("author");
        if (!post) return res.status(404).json({ message: "Post not found" });

        const reply = { author: req.user._id, text };
        post.replies.push(reply);
        await post.save();
        await post.populate("replies.author", "firstName lastName avatar");

        // 🔔 Notify post author (if replying to someone else)
        if (post.author._id.toString() !== req.user._id.toString()) {
        const replier = await User.findById(req.user._id).select("firstName lastName");
        const notif = await Notification.create({
            user: post.author._id,
            type: "post_reply",
            message: `${ replier.firstName } ${ replier.lastName } replied to your post.`,
            post: post._id,
        });
        if (req.io) req.io.to(post.author._id.toString()).emit("notification", notif);
        }

        res.json(post.replies[post.replies.length - 1]);
    } catch (err) {
        console.error("Error replying:", err);
        res.status(500).json({ message: "Server error" });
    }
    });

// ✅ SHARE a post
router.post("/:id/share", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        // Make sure req.user._id is present
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized: user ID missing" });
        }

        const originalPost = await Post.findById(req.params.id)
            .populate("author", "firstName lastName avatar")
            .populate("replies.author", "firstName lastName avatar");

        if (!originalPost) {
            return res.status(404).json({ message: "Original post not found" });
        }

        // Create the shared post
        const newPost = new Post({
            content: req.body?.content?.trim() || originalPost.content, // ✅ use original content if empty
            author: req.user._id,
            sharedFrom: originalPost._id,
        });

        await newPost.save();

        const populatedPost = await Post.findById(newPost._id)
            .populate("author", "firstName lastName avatar")
            .populate({
                path: "sharedFrom",
                populate: [
                    { path: "author", select: "firstName lastName avatar" },
                    { path: "replies.author", select: "firstName lastName avatar" },
                ],
            })
            .populate("replies.author", "firstName lastName avatar");

        res.status(201).json(populatedPost);
    } catch (err) {
        console.error("Error sharing post:", err); // ✅ full error
        res.status(500).json({ message: err.message || "Server error" }); // send exact error message
    }
});


// DELETE post
router.delete("/:id", checkToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // ✅ Consistent with your middleware
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await post.deleteOne();
        res.json({ message: "Post deleted", id: post._id });
    } catch (err) {
        console.error("Error deleting post:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// UPDATE post
router.put("/:id", checkToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // ✅ always use req.user._id
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        post.content = req.body.content || post.content;
        await post.save();
        res.json(post);
    } catch (err) {
        console.error("Error updating post:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ EDIT a reply
router.put("/:postId/replies/:replyId", checkToken, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Reply text is required" });
        }

        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const reply = post.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        // Only author can edit
        if (reply.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        reply.text = text;
        await post.save();
        await post.populate("replies.author", "firstName lastName avatar");

        res.json(reply);
    } catch (err) {
        console.error("Error editing reply:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ DELETE a reply
router.delete("/:postId/replies/:replyId", checkToken, ensureLoggedIn, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const reply = post.replies.id(req.params.replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        // Only the author of the reply can delete it
        if (reply.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Remove reply safely
        reply.deleteOne();
        await post.save();

        res.json({ message: "Reply deleted successfully", replyId: req.params.replyId });
    } catch (err) {
        console.error("Error deleting reply:", err);
        res.status(500).json({ message: "Server error" });
    }
});




export default router;

