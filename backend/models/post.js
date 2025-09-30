import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
  },
  { timestamps: true } // ✅ gives createdAt + updatedAt automatically
);

const Post = mongoose.model("Post", postSchema);
export default Post;



