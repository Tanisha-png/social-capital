

import React, { useEffect, useState } from "react";
import PostItem from "../../components/PostItem/PostItem";
import { useAuth } from "../../context/AuthContext";
import "./PostListPage.css";

export default function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  // Fetch all posts
  const fetchPosts = async () => {
    if (!token) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE || "http://localhost:3000"}/api/posts`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch posts: ${text}`);
      }

      const data = await res.json();

      // Sort posts newest first
      setPosts(
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
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

  // Handler to update or remove a post
  const handlePostUpdated = (updatedPost) => {
    if (updatedPost.deletedId) {
      // Remove deleted post from list
      setPosts((prev) => prev.filter((p) => p._id !== updatedPost.deletedId));
    } else {
      // Update edited/liked/replied post
      setPosts((prev) =>
        prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
      );
    }
  };

  // Handler to insert a new post at the top (from NewPostPage)
  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  // Handler to insert a shared post at the top
  const handlePostShared = (sharedPost) => {
    setPosts((prevPosts) => [sharedPost, ...prevPosts]);
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
              <PostItem
                post={post}
                onPostUpdated={handlePostUpdated}
                onNewPost={handleNewPost} // ✅ Allow NewPostPage to prepend
                onPostShared={handlePostShared}
                user={user}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
