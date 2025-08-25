import mongoose from "mongoose";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const postSchema = new Schema(
//   {
//     content: { type: String, required: true },
//     user: {
//       type: Schema.Types.ObjectId,
//       required: true,
//       ref: 'User'
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model('Post', postSchema);

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;