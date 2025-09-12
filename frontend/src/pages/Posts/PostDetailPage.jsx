import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PostDetailPage() {
  const { id } = useParams(); // post ID from URL
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState("");

    useEffect(() => {
        async function fetchPost() {
        try {
            const token = localStorage.getItem("token");
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
    }, [id]);

    async function handleReply(e) {
        e.preventDefault();
        if (!reply.trim()) return;

        try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/posts/${id}/reply`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: reply }),
        });
        const newReply = await res.json();
        setPost((prev) => ({
            ...prev,
            replies: [...(prev.replies || []), newReply],
        }));
        setReply("");
        } catch (err) {
        console.error("Error replying:", err);
        }
    }

    async function handleLike() {
        try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/posts/${id}/like`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });
        const updated = await res.json();
        setPost(updated);
        } catch (err) {
        console.error("Error liking post:", err);
        }
    }

    if (loading) return <p>Loading post...</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className="p-4 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-2">
            {post.author?.name || "Unknown User"}
        </h2>
        <p className="mb-4">{post.content}</p>

        <button
            onClick={handleLike}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
            👍 Like ({post.likes?.length || 0})
        </button>

        <div className="mt-6">
            <h3 className="font-semibold">Replies</h3>
            <ul className="space-y-2 mt-2">
            {post.replies?.length > 0 ? (
                post.replies.map((r, idx) => (
                <li key={idx} className="p-2 border rounded-md bg-gray-50">
                    <strong>{r.user?.firstName || "User"}:</strong> {r.content}
                </li>
                ))
            ) : (
                <p>No replies yet</p>
            )}
            </ul>

            {user && (
            <form onSubmit={handleReply} className="mt-4 flex gap-2">
                <input
                type="text"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 border p-2 rounded-lg"
                />
                <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                Reply
                </button>
            </form>
            )}
        </div>
        </div>
    );
}
