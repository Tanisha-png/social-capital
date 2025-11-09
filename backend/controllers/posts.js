

// backend/controllers/posts.js
import Post from "../models/post.js";
import { notifyUser } from "./notifications.js";

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName avatar")
      .populate("replies.author", "firstName lastName avatar")
      .populate("likes", "firstName lastName avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "firstName lastName avatar")
      .populate("replies.author", "firstName lastName avatar")
      .populate("likes", "firstName lastName avatar")
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
    console.error("Error fetching post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user._id) return res.status(401).json({ message: "User not found" });

    const post = new Post({ author: req.user._id, content: req.body.content });
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email avatar")
      .populate("replies.author", "firstName lastName email avatar")
      .populate("likes", "firstName lastName email avatar");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Error creating post" });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a reply
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Reply text is required" });

    const post = await Post.findById(req.params.id).populate("author", "firstName lastName email avatar");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = { author: req.user._id, text, createdAt: new Date() };
    post.replies.push(reply);
    await post.save();

    // Notify author
    if (post.author._id.toString() !== req.user._id.toString()) {
      await notifyUser({
        userId: post.author._id,
        fromUserId: req.user._id,
        type: "post_reply",
        message: `${req.user.firstName} ${req.user.lastName} replied to your post.`,
        post: post._id,
      });
    }

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email avatar")
      .populate("replies.author", "firstName lastName email avatar")
      .populate("likes", "firstName lastName email avatar");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error replying:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle like/unlike
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "firstName lastName email")
      .populate("likes", "firstName lastName email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const alreadyLiked = post.likes.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);

      if (post.author._id.toString() !== userId.toString()) {
        await notifyUser({
          userId: post.author._id,
          fromUserId: req.user._id,
          type: "post_like",
          message: `${req.user.firstName} ${req.user.lastName} liked your post.`,
          post: post._id,
        });
      }
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email")
      .populate("replies.author", "firstName lastName email")
      .populate("likes", "firstName lastName email");

    res.json(populatedPost);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Edit a reply
export const editReply = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Reply text is required" });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    reply.text = text;
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email avatar")
      .populate("replies.author", "firstName lastName email avatar")
      .populate("likes", "firstName lastName email avatar");

    res.json(populatedPost);
  } catch (err) {
    console.error("Error editing reply:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a reply
export const deleteReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    if (reply.author.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Unauthorized" });

    reply.deleteOne();
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email avatar")
      .populate("replies.author", "firstName lastName email avatar")
      .populate("likes", "firstName lastName email avatar");

    res.json(populatedPost);
  } catch (err) {
    console.error("Error deleting reply:", err);
    res.status(500).json({ message: "Server error" });
  }
};
