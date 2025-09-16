

import React, { useState } from "react";
import ReplyForm from "../ReplyForm/ReplyForm";
import "../../pages/PostListPage/PostListPage.css"; // make sure button styles are in your CSS

export default function PostItem({ post, onPostUpdated }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplyAdded = async (postId, updatedPost) => {
    onPostUpdated(updatedPost);
    setShowReplyForm(false);
  };

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:3000/api/posts/${post._id}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to like post");
      const updatedPost = await res.json();
      onPostUpdated(updatedPost);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article className="post-card">
      <p className="post-content">{post.content}</p>

      <small className="post-meta">
        By {post.author?.firstName} {post.author?.lastName} •{" "}
        {new Date(post.createdAt).toLocaleString()}
      </small>

      {/* Buttons side by side */}
      <div className="post-actions">
        <button className="post-btn" onClick={handleLikeToggle}>
          👍 {post.likes.length}
        </button>
        <button
          className="post-btn"
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          {showReplyForm ? "Cancel" : "Reply"}
        </button>
      </div>

      {/* Liked by list */}
      {post.likes.length > 0 && (
        <div className="liked-by">
          Liked by:{" "}
          {post.likes
            .map((user) => `${user.firstName} ${user.lastName}`)
            .join(", ")}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <ReplyForm postId={post._id} onReplyAdded={handleReplyAdded} />
      )}

      {/* Reply list */}
      {post.replies?.length > 0 && (
        <ul className="reply-list">
          {post.replies.map((reply) => (
            <li key={reply._id}>
              <strong>
                {reply.user.firstName} {reply.user.lastName}
              </strong>{" "}
              <span>{reply.content}</span>{" "}
              <small>{new Date(reply.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}






