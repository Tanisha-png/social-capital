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

// Utility to safely generate DiceBear avatar URLs
const getAvatarUrl = (user, index) => {
  if (!user) return "/default-avatar.png"; // fallback if user object is missing

    const seed =
        user._id ||
        user.id ||
        user.email ||
        user.username ||
        (user.firstName && user.lastName
        ? user.firstName + user.lastName
        : `user-${index}`);

    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
        seed
    )}`;
    };

    // Utility to get a safe display name
    const getDisplayName = (user) => {
    if (!user) return "Unknown User";

    const first = user.firstName || user.name || user.username || "Unknown";
    const last = user.lastName || "";
    return `${first} ${last}`.trim();
    };

    export default function ConnectionsList({ connections }) {
    // Debugging: see what the component receives
    console.log("🐛 ConnectionsList received:", connections);

    if (!connections) return <p>Loading connections…</p>;
    if (!connections.length) return <p>No connections yet.</p>;

    return (
        <ul className="connections-list">
        {connections.map((user, index) => (
            <li key={user?._id || user?.id || index} className="connection-item">
            <img
                src={getAvatarUrl(user, index)}
                alt={getDisplayName(user)}
                onError={(e) => {
                // Fallback if DiceBear fails
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
