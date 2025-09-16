

import React, { useEffect, useState } from "react";
import PostItem from "../../components/PostItem/PostItem";
import "./PostListPage.css";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all posts
  const fetchPosts = async () => {
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch posts: ${text}`);
      }

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handler to update a single post in state after reply or like
  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="post-list">
      <h2 className="feed-title">Posts</h2>

      {posts.length === 0 ? (
        <p className="no-posts">No posts yet.</p>
      ) : (
        <ul className="posts-feed">
          {posts.map((post) => (
            <li key={post._id}>
              <PostItem post={post} onPostUpdated={handlePostUpdated} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
