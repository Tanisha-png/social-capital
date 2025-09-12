// import { io } from "../server.js";
// import Post from "../models/post.js";
// import { notifyUser } from "./notifications.js";
// import User from "../models/User.js";

// export const getPosts = async (req, res) => {
//   try {
//     const posts = await Post.find().populate("author", "name email");
//     res.json([{ id: 1, content: "Hello World!", author: "Test User" }]);
//     res.json(posts);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching posts" });
//   }
// };

// Get a single post by ID
// export const getPostById = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id)
//       .populate("author", "firstName lastName email")
//       .populate("replies.user", "firstName lastName email");

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     res.json(post);
//   } catch (err) {
//     console.error("Error fetching post:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const createPost = async (req, res) => {
//   try {
//     const { content } = req.body;
//     res.json({ id: Date.now(), content, author: "LoggedInUser" });
//     const post = new Post({
//       author: req.user._id,
//       content: req.body.content,
//     });
//     await post.save();
//     res.json(post);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating post" });
//   }
// };

// export const createPost = async (req, res) => {
//   try {
//     const post = new Post({
//       author: req.user._id,
//       content: req.body.content,
//     });
//     await post.save();
//     res.status(201).json(post);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating post" });
//   }
// };

// export const deletePost = async (req, res) => {
//   try {
//     await Post.findByIdAndDelete(req.params.id);
//     res.json({ message: "Post deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting post" });
//   }
// };

// // Reply to a post
// export async function reply(req, res) {
//   const { postId, content } = req.body;
//   const userId = req.user.id;

//   const post = await Post.findById(postId).populate("author");
//   if (!post) return res.status(404).json({ message: "Post not found" });

//   const reply = { user: userId, content, createdAt: new Date() };
//   post.replies.push(reply);
//   await post.save();

//   if (post.author._id.toString() !== userId) {
//     await notifyUser({
//       userId: post.author._id,
//       type: "post_reply",
//       message: `${req.user.firstName} replied to your post`,
//       post: post._id,
//     });
//   }

//   res.status(201).json(reply);
// }

// Reply to a post
// export const addReply = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const reply = {
//       user: req.user._id,
//       content: req.body.content,
//       createdAt: new Date(),
//     };

//     post.replies.push(reply);
//     await post.save();

//     // Populate reply with user info for frontend
//     const populatedPost = await Post.findById(req.params.id)
//       .populate("author", "firstName lastName email")
//       .populate("replies.user", "firstName lastName email");

//     res.status(201).json(populatedPost.replies[populatedPost.replies.length - 1]);
//   } catch (err) {
//     console.error("Error replying:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Like a post
// export async function like(req, res) {
//   const { postId } = req.body;
//   const userId = req.user.id;

//   const post = await Post.findById(postId).populate("author");
//   if (!post) return res.status(404).json({ message: "Post not found" });

//   if (!post.likes.includes(userId)) post.likes.push(userId);
//   await post.save();

//   if (post.author._id.toString() !== userId) {
//     await notifyUser({
//       userId: post.author._id,
//       type: "post_like",
//       message: `${req.user.firstName} liked your post`,
//       post: post._id,
//     });
//   }

//   res.status(200).json(post);
// }

// Like / unlike a post
// export const toggleLike = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const userId = req.user._id;

//     const alreadyLiked = post.likes.includes(userId);
//     if (alreadyLiked) {
//       post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
//     } else {
//       post.likes.push(userId);
//     }

//     await post.save();
//     res.json(post);
//   } catch (err) {
//     console.error("Error liking post:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// backend/controllers/posts.js
import Post from "../models/post.js";
// import user from "../models/user.js";
import { sendEmail, createNotification } from "./notifications.js";
// import { sendEmail } from "../utils/email.js"; // optional helper if you add nodemailer

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName email")
      .populate("replies.user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    const post = new Post({
      author: req.user._id,
      content: req.body.content,
    });

    await post.save();

    // Populate author immediately for frontend
    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email")
      .populate("replies.user", "firstName lastName email");

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
      .populate("author", "firstName lastName email")
      .populate("replies.user", "firstName lastName email");

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
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const reply = {
      user: req.user._id,
      content: req.body.content,
      createdAt: new Date(),
    };

    post.replies.push(reply);
    await post.save();

    // Notifications
    if (post.author.toString() !== req.user._id.toString()) {
      const message = `${req.user.firstName} ${req.user.lastName} replied to your post.`;
      await sendEmail(post.author.email, "New Reply", message);
      await createNotification({
        userId: post.author,
        type: "post_reply",
        message,
        postId: post._id,
      });
    }

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email")
      .populate("replies.user", "firstName lastName email");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error replying:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle like/unlike
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "firstName lastName email")
      .populate("replies.user", "firstName lastName email");

    res.json(populatedPost);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ message: "Server error" });
  }
};
