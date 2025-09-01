
import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name email");
    res.json([{ id: 1, content: "Hello World!", author: "Test User" }]);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    res.json({ id: Date.now(), content, author: "LoggedInUser" });
    const post = new Post({
      author: req.user._id,
      content: req.body.content,
    });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error creating post" });
  }
};

export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
};