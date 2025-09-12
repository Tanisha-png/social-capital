
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./NewPostPage.css";

export default function NewPostPage({ onNewPost }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !content.trim()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to create post: ${text}`);
      }

      const newPost = await res.json();

      // Prepend new post in PostListPage
      if (onNewPost) onNewPost(newPost);

      setContent(""); // clear textarea
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!user) return <p>Loading...</p>;

  return (
    <form className="new-post-form" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        rows={4}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}




