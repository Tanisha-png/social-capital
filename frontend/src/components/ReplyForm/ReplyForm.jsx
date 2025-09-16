import React, { useState } from "react";

export default function ReplyForm({ postId, onReplyAdded }) {
    const [content, setContent] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        const token = localStorage.getItem("token");

        try {
        const res = await fetch(
            `http://localhost:3000/api/posts/${postId}/replies`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
            }
        );

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Failed to add reply: ${text}`);
        }

        const updatedPost = await res.json(); // ✅ backend returns full post
        onReplyAdded(updatedPost); // send full post back to PostItem
        setContent("");
        } catch (err) {
        console.error(err);
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
