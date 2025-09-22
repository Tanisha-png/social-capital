

import React, { useState } from "react";
import ReplyForm from "../ReplyForm/ReplyForm";
import "../../pages/PostListPage/PostListPage.css";
import "./PostItem.css";

export default function PostItem({ post, onPostUpdated }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplyAdded = (newReply) => {
    const updatedPost = {
      ...post,
      replies: [...post.replies, newReply],
    };
    onPostUpdated(updatedPost);
    setShowReplyForm(false);
  };

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token)
      return console.error("No token found — user might not be logged in");

    try {
      const res = await fetch(
        `http://localhost:3000/api/posts/${post._id}/like`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to like post: ${errorText}`);
      }

      const updatedPost = await res.json();
      onPostUpdated(updatedPost);
    } catch (err) {
      console.error("Error in handleLikeToggle:", err);
    }
  };

  const handleShare = () => alert("Share feature coming soon!");

  return (
    <article className="post-card">
      <div className="post-header">
        {post.author?.avatar && (
          <img
            src={
              post.author.avatar.startsWith("http")
                ? post.author.avatar
                : `http://localhost:3000${post.author.avatar}`
            }
            alt={`${post.author.firstName} ${post.author.lastName}`}
            className="post-avatar"
          />
        )}
        <div className="post-meta">
          <span className="post-author">
            {post.author?.firstName} {post.author?.lastName}
          </span>
          <span className="post-timestamp">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="post-actions-row">
        <button className="post-btn" onClick={handleLikeToggle}>
          👍 {post.likes?.length || 0}
        </button>
        <button
          className="post-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          💬 {post.replies?.length || 0}
        </button>
        <button className="post-btn" onClick={handleShare}>
          🔄 Share
        </button>
      </div>

      {showReplyForm && (
        <ReplyForm postId={post._id} onReplyAdded={handleReplyAdded} />
      )}

      {post.replies?.length > 0 && (
        <ul className="reply-list">
          {post.replies.map((reply) => (
            <li key={reply._id}>
              <strong>
                {reply.author?.firstName} {reply.author?.lastName}
              </strong>{" "}
              <span>{reply.text}</span>{" "}
              <small>{new Date(reply.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}






