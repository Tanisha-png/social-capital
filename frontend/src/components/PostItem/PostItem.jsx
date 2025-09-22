

import React, { useState } from "react";
import ReplyForm from "../ReplyForm/ReplyForm";
import "../../pages/PostListPage/PostListPage.css";
import "./PostItem.css";

export default function PostItem({ post, onPostUpdated, onPostShared }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  // ✅ Add a new reply
  const handleReplyAdded = (newReply) => {
    const updatedPost = {
      ...post,
      replies: [...post.replies, newReply],
    };
    onPostUpdated(updatedPost);
    setShowReplyForm(false);
  };

  // ✅ Like/unlike toggle
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

      if (!res.ok) throw new Error(await res.text());

      const updatedPost = await res.json();
      onPostUpdated(updatedPost);
    } catch (err) {
      console.error("Error in handleLikeToggle:", err);
    }
  };

  // ✅ Share logic (creates a new post in feed)
  const handleShare = async () => {
    const token = localStorage.getItem("token");
    if (!token)
      return console.error("No token found — user might not be logged in");

    try {
      const res = await fetch(
        `http://localhost:3000/api/posts/${post._id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: "" }), // empty string ensures validation passes
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const sharedPost = await res.json();

      // 🔹 Inform parent to insert new shared post
      if (onPostShared) onPostShared(sharedPost);
    } catch (err) {
      console.error("Error sharing post:", err);
      alert("Error sharing post. Try again.");
    }
  };

  return (
    <article className="post-card">
      {/* Author info */}
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

      {/* Post content */}
      <p className="post-content">{post.content}</p>

      {/* ✅ Shared post preview */}
      {post.sharedFrom && (
        <div className="shared-post">
          <small>
            🔄 Shared from {post.sharedFrom.author?.firstName}{" "}
            {post.sharedFrom.author?.lastName}
          </small>
          <p className="shared-content">
            {post.sharedFrom.content || "(No text)"}
          </p>

          {/* Optional: show replies of shared post */}
          {post.sharedFrom.replies?.length > 0 && (
            <ul className="reply-list shared-replies">
              {post.sharedFrom.replies.map((reply) => (
                <li key={reply._id}>
                  <strong>
                    {reply.author?.firstName} {reply.author?.lastName}
                  </strong>{" "}
                  <span>{reply.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Like / Comment / Share row */}
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

      {/* Reply form */}
      {showReplyForm && (
        <ReplyForm postId={post._id} onReplyAdded={handleReplyAdded} />
      )}

      {/* Replies list */}
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






