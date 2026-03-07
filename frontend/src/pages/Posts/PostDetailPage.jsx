import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import PostItem from "../../components/PostItem/PostItem";
import "./PostDetailPage.css";

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

            // Safety: ensure post and author exist
            if (!data || !data._id) {
            setPost(null);
            } else {
            setPost({
                ...data,
                author: data.author || null, // if author deleted
            });
            }
        } catch (err) {
            console.error("Error fetching post:", err);
            setPost(null);
        } finally {
            setLoading(false);
        }
        }
        fetchPost();
    }, [id, token]);

    const handlePostUpdated = (updatedPost) => setPost(updatedPost);

    if (loading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className="post-list">
        <h2 className="feed-title">Post</h2>
        <ul className="posts-feed">
            <li>
            <PostItem
                post={{
                ...post,
                author: post.author || { firstName: "Deleted", lastName: "User" },
                }}
                onPostUpdated={handlePostUpdated}
                onNewPost={null}
                onPostShared={null}
            />
            </li>
        </ul>
        </div>
    );
}
