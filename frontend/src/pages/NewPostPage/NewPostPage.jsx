
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function NewPostPage() {
  const { user } = useAuth();
  const [content, setContent] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    const token = localStorage.getItem("token");
    await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    setContent(""); // clear form
    alert("Post created!");
  }

  if (!user) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
      />
      <button type="submit">Post</button>
    </form>
  );
}

