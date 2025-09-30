
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostItem from "../../components/PostItem/PostItem";
import "./PostDetailPage.css"; // reuse same styles as PostListPage

export default function PostDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        async function fetchPost() {
        try {
            const res = await fetch(`/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setPost(data);
        } catch (err) {
            console.error("Error fetching post:", err);
        } finally {
            setLoading(false);
        }
        }
        fetchPost();
    }, [id, token]);

    // Handlers can be passed to PostItem
    const handlePostUpdated = (updatedPost) => setPost(updatedPost);

    if (loading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className="post-list">
        <h2 className="feed-title">Post</h2>
        <ul className="posts-feed">
            <li>
            <PostItem
                post={post}
                onPostUpdated={handlePostUpdated}
                onNewPost={null} // not needed for detail view
                onPostShared={null} // not needed for detail view
            />
            </li>
        </ul>
        </div>
    );
}
