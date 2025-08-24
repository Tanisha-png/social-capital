// const Post = require('../models/post');

// module.exports = {
//   create,
//   index
// };

// async function index(req, res) {
//   const posts = await Post.find({}).populate('user').sort('-createdAt');
//   res.json(posts);
// }

// async function create(req, res) {
//   try {
//     req.body.user = req.user._id;
//     const post = await Post.create(req.body);
//     res.json(post);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: 'Create Post Failed' });
//   }
// }

import Post from "../models/post.js";

// Create a new post
export const create = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      text: req.body.text,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all posts
export const index = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a post
export const remove = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
