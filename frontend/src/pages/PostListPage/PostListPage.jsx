

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewPostPage from "../NewPostPage/NewPostPage";
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

      // Ensure author exists
      const postsWithAuthor = data.map((post) => ({
        ...post,
        author: post.author || { firstName: "Unknown", lastName: "" },
      }));

      setPosts(postsWithAuthor);
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

  // Handler to prepend new post
  const handleNewPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="post-list">
      <h2 className="feed-title">Posts</h2>

      {/* New post form */}
      <NewPostPage onNewPost={handleNewPost} />

      {posts.length === 0 ? (
        <p className="no-posts">No posts yet.</p>
      ) : (
        <ul className="posts-feed">
          {posts.map((post) => (
            <li key={post._id} className="post-card">
              <p className="post-content">{post.content}</p>
              <small className="post-author">
                By {post.author.firstName} {post.author.lastName}
              </small>
              <Link to={`/posts/${post._id}`} className="post-link">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
