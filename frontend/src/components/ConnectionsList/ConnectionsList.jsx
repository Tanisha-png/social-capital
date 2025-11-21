// import React from "react";
// import "./ConnectionsList.css";

// export default function ConnectionsList({ connections }) {
//     if (!connections || !connections.length) return <p>No connections yet.</p>;

//     return (
//         <ul className="connections-list">
//         {connections.map((c) => (
//             <li key={c._id}>
//             <img
//                 src={
//                 c.profileImage
//                     ? `${window.location.origin}${c.profileImage}`
//                     : "/default-avatar.png"
//                 }
//                 alt={`${c.firstName} ${c.lastName}`}
//                 onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//             />
//             <span>
//                 {c.firstName} {c.lastName}
//             </span>
//             </li>
//         ))}
//         </ul>
//     );
// }

import React from "react";
import "./ConnectionsList.css";

export default function ConnectionsList({ connections }) {
    console.log("🐛 CONNECTIONS:", connections);

    if (!connections || !connections.length) return <p>No connections yet.</p>;

    // Generate a consistent seed for DiceBear
    const getSeed = (user, index) => {
        // Use _id, id, or email/username; fallback to index
        return (
        user?._id ||
        user?.id ||
        user?.email ||
        user?.username ||
        (user?.firstName && user?.lastName
            ? user.firstName + user.lastName
            : `user-${index}`)
        );
    };

    const getAvatarUrl = (user, index) =>
        `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
        getSeed(user, index)
        )}`;

    const getDisplayName = (user) => {
        const first = user?.firstName || user?.name || user?.username || "Unknown";
        const last = user?.lastName || "";
        return `${first} ${last}`.trim();
    };

    return (
        <ul className="connections-list">
        {connections.map((user, i) => (
            <li key={user._id || user.id || i} className="connection-item">
            <img
                src={getAvatarUrl(user, i)}
                alt={getDisplayName(user)}
                onError={(e) => {
                e.currentTarget.src =
                    "https://via.placeholder.com/50?text=Avatar";
                }}
                className="connection-avatar"
            />
            <span className="connection-name">{getDisplayName(user)}</span>
            </li>
        ))}
        </ul>
    );
}
