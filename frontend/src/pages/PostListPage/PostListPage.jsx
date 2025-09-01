
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PostListPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      if (!user) return;
      const token = localStorage.getItem("token");
      const res = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, [user]);

  if (!user) return <p>Loading posts...</p>;

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post._id}>{post.content}</div>
      ))}
    </div>
  );
}
