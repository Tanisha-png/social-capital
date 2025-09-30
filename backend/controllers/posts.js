

// backend/controllers/posts.js
import Post from "../models/post.js";
import { sendEmail, notifyUser } from "./notifications.js";

const migratePosts = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/yourdbname");

  const posts = await Post.find({ author: { $exists: true } });
  for (let post of posts) {
    post.user = post.author;  // move author into user
    post.author = undefined;  // remove old field
    await post.save();
  }

  console.log("Migration complete!");
  process.exit();
};

// migratePosts();

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "firstName lastName avatar") // ✅ populate user details
      .populate("replies.author", "firstName lastName avatar") // ✅ replies too
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not found" });
    }

    const post = new Post({
      author: req.user._id, // 🔹 use author consistently
      content: req.body.content,
    });

    await post.save();

    // Populate author for frontend display
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

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add reply
export const addReply = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const post = await Post.findById(req.params.id).populate(
      "author",
      "firstName lastName email avatar"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    // ✅ Keep reply shape consistent: { author, text, createdAt }
    const reply = {
      author: req.user._id,
      text,
      createdAt: new Date(),
    };

    post.replies.push(reply);
    await post.save();

    // ✅ Notify post author if someone else replied
    if (post.author._id.toString() !== req.user._id.toString()) {
      const message = `${req.user.firstName} ${req.user.lastName} replied to your post.`;
      await sendEmail(post.author.email, "New Reply", message);
      await notifyUser({
        userId: post.author._id,
        type: "post_reply",
        message,
        post: post._id,
      });
    }

    // ✅ Re-fetch post with populated replies for frontend
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
    const post = await Post.findById(req.params.id).populate("author", "firstName lastName email");
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId);

      if (post.author._id.toString() !== userId.toString()) {
        const message = `${req.user.firstName} ${req.user.lastName} liked your post.`;
        await sendEmail(post.author.email, "New Like", message);
        await notifyUser({
          userId: post.author._id,
          type: "post_like",
          message,
          post: post._id,
        });
      }
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email")
      .populate("replies.user", "firstName lastName email")
      .populate("likes", "firstName lastName email");

    res.json(populatedPost);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ EDIT a reply
export const editReply = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    // ✅ Only author can edit
    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

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

// ✅ DELETE a reply
export const deleteReply = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = post.replies.id(req.params.replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    // ✅ Only author can delete
    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    reply.deleteOne(); // ✅ safe removal
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
