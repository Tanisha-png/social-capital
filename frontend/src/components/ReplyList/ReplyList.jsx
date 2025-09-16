import React from "react";

export default function ReplyList({ replies }) {
    if (replies.length === 0)
        return <p className="no-replies">No replies yet.</p>;

    return (
        <ul className="reply-list">
        {replies.map((reply) => (
            <li key={reply._id} className="reply-item">
            <p>{reply.content}</p>
            <small>
                By {reply.user?.firstName} {reply.user?.lastName} •{" "}
                {new Date(reply.createdAt).toLocaleString()}
            </small>
            </li>
        ))}
        </ul>
    );
}
