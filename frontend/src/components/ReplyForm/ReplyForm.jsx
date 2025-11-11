import React, { useState } from "react";

export default function ReplyForm({ postId, onReplyAdded }) {
  const [content, setContent] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/posts/${postId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: content }), // ✅ send "text"
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to add reply: ${text}`);
      }

      const newReply = await res.json(); // ✅ backend sends back single reply
      onReplyAdded(newReply); // ✅ pass the reply, not a whole "post"
      setContent("");
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("Error adding reply. Try again.");
    }
  };

  return (
    <form className="reply-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a reply..."
        required
      />
      <button type="submit">Reply</button>
    </form>
  );
}
