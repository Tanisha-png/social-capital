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
    content: {
      type: String,
      required: function () {
        // Only require content if this post is not a share
        return !this.sharedFrom;
      },
      trim: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [replySchema],
    sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;



