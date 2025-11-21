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
  // Fallback message if no connections
    if (!connections || !connections.length) return <p>No connections yet.</p>;

    // Robust avatar URL generator
    const getAvatarUrl = (user, index) => {
        if (!user) return "https://via.placeholder.com/50?text=Avatar";

        // Use the first available property as seed
        let seed =
        user._id ||
        user.id ||
        user.email ||
        user.username ||
        (user.firstName && user.lastName ? user.firstName + user.lastName : null);

        // Fallback to index-based seed if nothing available
        if (!seed) seed = `user-${index}`;

        // Encode seed to ensure URL-safe string
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
        seed
        )}`;
    };

    // Robust display name generator
    const getDisplayName = (user) => {
        if (!user) return "Unknown User";

        const first = user.firstName || user.name || user.username || "Unknown";
        const last = user.lastName || "";
        return `${first} ${last}`.trim();
    };

    return (
        <ul className="connections-list">
        {connections.map((user, index) => (
            <li key={user?._id || user?.id || index} className="connection-item">
            <img
                src={getAvatarUrl(user, index)}
                alt={getDisplayName(user)}
                className="connection-avatar"
                onError={(e) => {
                // Fallback placeholder if DiceBear fails
                e.currentTarget.src =
                    "https://via.placeholder.com/50?text=Avatar";
                }}
            />
            <span className="connection-name">{getDisplayName(user)}</span>
            </li>
        ))}
        </ul>
    );
}
