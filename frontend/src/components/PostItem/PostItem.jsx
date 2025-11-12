

import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReplyForm from "../ReplyForm/ReplyForm";
import "../../pages/PostListPage/PostListPage.css";
import "./PostItem.css";

export default function PostItem({
  post,
  onPostUpdated,
  onNewPost,
  onPostShared,
  user,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [localAuthor] = useState(post.author);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyEditContent, setReplyEditContent] = useState("");
  const [editingSharedReplyId, setEditingSharedReplyId] = useState(null);
  const [sharedReplyEditContent, setSharedReplyEditContent] = useState("");
  const [localSharedAuthor] = useState(post.sharedFrom?.author);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
  const isOwner = post.author?._id === user?._id;

  const handleReplyAdded = (newReply) => {
    const updatedPost = { ...post, replies: [...post.replies, newReply] };
    onPostUpdated(updatedPost);
    setShowReplyForm(false);
  };

  const handleLikeToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");

    try {
      const res = await fetch(`${API_BASE}/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(await res.text());

      const updatedPost = await res.json();
      onPostUpdated(updatedPost); // ✅ now has full likes array
    } catch (err) {
      console.error("Error in handleLikeToggle:", err);
    }
  };

  const handleShare = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found");
    try {
      const res = await fetch(`${API_BASE}/api/posts/${post._id}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: "" }),
      });
      if (!res.ok) throw new Error(await res.text());
      const sharedPost = await res.json();
      if (onPostShared) onPostShared(sharedPost);
    } catch (err) {
      console.error("Error sharing post:", err);
      alert("Error sharing post. Try again.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/posts/${post._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      onPostUpdated({ deletedId: post._id });
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete post.");
    }
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/api/posts/${post._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: editContent }),
      });
      if (!res.ok) throw new Error(await res.text());
      const updatedPost = await res.json();
      onPostUpdated(updatedPost);
      setEditing(false);
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to update post.");
    }
  };

  const handleReplySaveEdit = async (replyId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/posts/${post._id}/replies/${replyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: replyEditContent }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updatedReply = await res.json();
      const updatedPost = {
        ...post,
        replies: post.replies.map((r) =>
          r._id === replyId ? updatedReply : r
        ),
      };
      onPostUpdated(updatedPost);
      setEditingReplyId(null);
      setReplyEditContent("");
    } catch (err) {
      console.error("Reply edit error:", err);
      alert("Failed to update reply.");
    }
  };

  const handleReplyDelete = async (replyId) => {
    if (!confirm("Delete this reply?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/posts/${post._id}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updatedPost = {
        ...post,
        replies: post.replies.filter((r) => r._id !== replyId),
      };
      onPostUpdated(updatedPost);
    } catch (err) {
      console.error("Reply delete error:", err);
      alert("Failed to delete reply.");
    }
  };

  const handleSharedReplySaveEdit = async (replyId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/posts/${post.sharedFrom._id}/replies/${replyId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: sharedReplyEditContent }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updatedReply = await res.json();
      const updatedShared = {
        ...post.sharedFrom,
        replies: post.sharedFrom.replies.map((r) =>
          r._id === replyId ? updatedReply : r
        ),
      };
      onPostUpdated({ ...post, sharedFrom: updatedShared });
      setEditingSharedReplyId(null);
      setSharedReplyEditContent("");
    } catch (err) {
      console.error("Shared reply edit error:", err);
      alert("Failed to update shared reply.");
    }
  };

  const handleSharedReplyDelete = async (replyId) => {
    if (!confirm("Delete this shared reply?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/posts/${post.sharedFrom._id}/replies/${replyId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const updatedShared = {
        ...post.sharedFrom,
        replies: post.sharedFrom.replies.filter((r) => r._id !== replyId),
      };
      onPostUpdated({ ...post, sharedFrom: updatedShared });
    } catch (err) {
      console.error("Shared reply delete error:", err);
      alert("Failed to delete shared reply.");
    }
  };

  return (
    <article className="post-card">
      {/* Post Header */}
      <div className="post-header">
        {localAuthor?.avatar && (
          <Link to={`/profile/${localAuthor._id}`}>
            {/* <img
              src={
                localAuthor.avatar.startsWith("http")
                  ? localAuthor.avatar
                  : `${API_BASE}${localAuthor.avatar}`
              }
              alt={`${localAuthor.firstName} ${localAuthor.lastName}`}
              className="post-avatar"
            /> */}
            
            <img
              src={
                localAuthor.avatar.startsWith("http")
                  ? localAuthor.avatar
                  : // --- MODIFIED LOGIC HERE ---
                    // If it's NOT an "http" link (meaning it's an old local path or a relative path),
                    // we ignore the local path and use the DiceBear fallback instead.
                    `https://api.dicebear.com/9.x/pixel-art/svg?seed=${localAuthor.id}`
                // You can use localAuthor._id if your ID is named that
              }
              alt={`${localAuthor.firstName} ${localAuthor.lastName}`}
              className="post-avatar"
            />
          </Link>
        )}
        <div className="post-meta">
          <Link to={`/profile/${localAuthor._id}`} className="post-author">
            {localAuthor?.firstName} {localAuthor?.lastName}
          </Link>
          <span className="post-timestamp">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Post Content */}
      {editing ? (
        <div className="edit-post-form">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            className="post-btn bg-green-500 text-white"
            onClick={handleSaveEdit}
          >
            Save
          </button>
          <button
            className="post-btn bg-gray-300"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="post-content">{post.content}</p>
      )}

      {/* Shared Post */}
      {post.sharedFrom && (
        <div className="shared-post">
          <div className="shared-header">
            {localSharedAuthor?.avatar && (
              <Link to={`/profile/${localSharedAuthor._id}`}>
                {/* <img
                  src={
                    localSharedAuthor.avatar.startsWith("http")
                      ? localSharedAuthor.avatar
                      : `${API_BASE}${localSharedAuthor.avatar}`
                  }
                  alt={`${localSharedAuthor.firstName} ${localSharedAuthor.lastName}`}
                  className="post-avatar"
                /> */}
                
                <img
                  src={
                    localAuthor.avatar.startsWith("http")
                      ? localAuthor.avatar
                      : // --- MODIFIED LOGIC HERE ---
                        // If it's NOT an "http" link (meaning it's an old local path or a relative path),
                        // we ignore the local path and use the DiceBear fallback instead.
                        `https://api.dicebear.com/9.x/pixel-art/svg?seed=${localAuthor.id}`
                    // You can use localAuthor._id if your ID is named that
                  }
                  alt={`${localAuthor.firstName} ${localAuthor.lastName}`}
                  className="post-avatar"
                />
              </Link>
            )}
            <small>
              🔄 Shared from{" "}
              <Link to={`/profile/${localSharedAuthor._id}`}>
                {localSharedAuthor?.firstName} {localSharedAuthor?.lastName}
              </Link>
            </small>
          </div>
          <p className="shared-content">
            {post.sharedFrom.content || "(No text)"}
          </p>

          {post.sharedFrom.replies?.length > 0 && (
            <ul className="reply-list shared-replies">
              {post.sharedFrom.replies.map((reply) => {
                const isSharedReplyOwner = reply.author?._id === user?._id;
                const localReplyAuthor = reply.author;
                return (
                  <li key={reply._id} className="reply-item">
                    {localReplyAuthor?.avatar && (
                      <Link to={`/profile/${localReplyAuthor._id}`}>
                        {/* <img
                          src={
                            localReplyAuthor.avatar.startsWith("http")
                              ? localReplyAuthor.avatar
                              : `${API_BASE}${localReplyAuthor.avatar}`
                          }
                          alt={`${localReplyAuthor.firstName} ${localReplyAuthor.lastName}`}
                          className="reply-avatar"
                        /> */}
                        
                        <img
                          src={
                            localAuthor.avatar.startsWith("http")
                              ? localAuthor.avatar
                              : // --- MODIFIED LOGIC HERE ---
                                // If it's NOT an "http" link (meaning it's an old local path or a relative path),
                                // we ignore the local path and use the DiceBear fallback instead.
                                `https://api.dicebear.com/9.x/pixel-art/svg?seed=${localAuthor.id}`
                            // You can use localAuthor._id if your ID is named that
                          }
                          alt={`${localAuthor.firstName} ${localAuthor.lastName}`}
                          className="post-avatar"
                        />
                      </Link>
                    )}
                    <div className="reply-content">
                      <Link to={`/profile/${localReplyAuthor._id}`}>
                        <strong>
                          {localReplyAuthor?.firstName}{" "}
                          {localReplyAuthor?.lastName}
                        </strong>
                      </Link>
                      {editingSharedReplyId === reply._id ? (
                        <>
                          <textarea
                            value={sharedReplyEditContent}
                            onChange={(e) =>
                              setSharedReplyEditContent(e.target.value)
                            }
                            className="border p-2 rounded w-full"
                          />
                          <button
                            className="post-btn bg-green-500 text-white"
                            onClick={() => handleSharedReplySaveEdit(reply._id)}
                          >
                            Save
                          </button>
                          <button
                            className="post-btn bg-gray-300"
                            onClick={() => setEditingSharedReplyId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span>{reply.text}</span>
                      )}
                      <small>
                        {new Date(reply.createdAt).toLocaleString()}
                      </small>
                      {isSharedReplyOwner && (
                        <div className="comment-actions">
                          <button
                            onClick={() => {
                              setEditingSharedReplyId(reply._id);
                              setSharedReplyEditContent(reply.text);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSharedReplyDelete(reply._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="post-actions-row">
        <button className="post-btn" onClick={handleLikeToggle}>
          👍 {post.likes?.length || 0}
        </button>
        <button className="post-btn" onClick={() => setShowLikesModal(true)}>
          View Likes
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
        {isOwner && (
          <>
            <button
              className="post-btn bg-gray-300"
              onClick={() => setEditing(true)}
              disabled={editing}
            >
              ✏️ Edit
            </button>
            <button className="post-btn text-red-500" onClick={handleDelete}>
              🗑 Delete
            </button>
          </>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <ReplyForm postId={post._id} onReplyAdded={handleReplyAdded} />
      )}

      {/* Replies */}
      {post.replies?.length > 0 && (
        <ul className="reply-list">
          {post.replies.map((reply) => {
            const isReplyOwner = reply.author?._id === user?._id;
            const localReplyAuthor = reply.author;
            return (
              <li key={reply._id} className="reply-item">
                {localReplyAuthor?.avatar && (
                  <Link to={`/profile/${localReplyAuthor._id}`}>
                    {/* <img
                      src={
                        localReplyAuthor.avatar.startsWith("http")
                          ? localReplyAuthor.avatar
                          : `${API_BASE}${localReplyAuthor.avatar}`
                      }
                      alt={`${localReplyAuthor.firstName} ${localReplyAuthor.lastName}`}
                      className="reply-avatar"
                    /> */}
                    
                    <img
                      src={
                        localAuthor.avatar.startsWith("http")
                          ? localAuthor.avatar
                          : // --- MODIFIED LOGIC HERE ---
                            // If it's NOT an "http" link (meaning it's an old local path or a relative path),
                            // we ignore the local path and use the DiceBear fallback instead.
                            `https://api.dicebear.com/9.x/pixel-art/svg?seed=${localAuthor.id}`
                        // You can use localAuthor._id if your ID is named that
                      }
                      alt={`${localAuthor.firstName} ${localAuthor.lastName}`}
                      className="post-avatar"
                    />
                  </Link>
                )}
                <div className="reply-content">
                  <Link to={`/profile/${localReplyAuthor._id}`}>
                    <strong>
                      {localReplyAuthor?.firstName} {localReplyAuthor?.lastName}
                    </strong>
                  </Link>
                  {editingReplyId === reply._id ? (
                    <>
                      <textarea
                        value={replyEditContent}
                        onChange={(e) => setReplyEditContent(e.target.value)}
                        className="border p-2 rounded w-full"
                      />
                      <button
                        className="post-btn bg-green-500 text-white"
                        onClick={() => handleReplySaveEdit(reply._id)}
                      >
                        Save
                      </button>
                      <button
                        className="post-btn bg-gray-300"
                        onClick={() => setEditingReplyId(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <span>{reply.text}</span>
                  )}
                  <small>{new Date(reply.createdAt).toLocaleString()}</small>
                  {isReplyOwner && (
                    <div className="comment-actions">
                      <button
                        onClick={() => {
                          setEditingReplyId(reply._id);
                          setReplyEditContent(reply.text);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleReplyDelete(reply._id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <div
          className="likes-modal-backdrop"
          onClick={() => setShowLikesModal(false)}
        >
          <div className="likes-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Liked by</h3>
            <ul>
              {post.likes?.length > 0 ? (
                post.likes.map((u) => (
                  <li key={u._id}>
                    <Link to={`/profile/${u._id}`}>
                      {u.firstName} {u.lastName}
                    </Link>
                  </li>
                ))
              ) : (
                <p>No likes yet</p>
              )}
            </ul>
            <button
              className="close-btn"
              onClick={() => setShowLikesModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
