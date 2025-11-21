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
  // If no array or empty array
    if (!Array.isArray(connections) || connections.length === 0) {
        return <p>No connections yet.</p>;
    }

    // --- 100% Bulletproof Avatar Generator ---
    const getAvatarUrl = (user, index) => {
        if (!user || typeof user !== "object") {
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=unknown-${index}`;
        }

        // Try all fields in priority order
        let seed =
        user._id ||
        user.id ||
        user.email ||
        user.username ||
        (user.firstName && user.lastName
            ? `${user.firstName}-${user.lastName}`
            : null);

        // If user object is empty or missing all fields
        if (!seed || typeof seed !== "string") {
        seed = `user-${index}`;
        }

        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
        seed
        )}`;
    };

    // --- 100% Bulletproof Display Name ---
    const getDisplayName = (user, index) => {
        if (!user || typeof user !== "object") {
        return `Unknown User ${index + 1}`;
        }

        const first =
        user.firstName ||
        user.name ||
        user.username ||
        user.email ||
        `User${index + 1}`;

        const last = user.lastName || "";

        return `${first} ${last}`.trim();
    };

    return (
        <ul className="connections-list">
        {connections.map((user, index) => {
            const avatar = getAvatarUrl(user, index);
            const name = getDisplayName(user, index);

            return (
            <li
                key={user?._id || user?.id || `conn-${index}`}
                className="connection-item"
            >
                <img
                src={avatar}
                alt={name}
                className="connection-avatar"
                onError={(e) => {
                    // Ensure fallback is also DiceBear, never broken
                    e.currentTarget.src = `https://api.dicebear.com/9.x/pixel-art/svg?seed=fallback-${index}`;
                }}
                />

                <span className="connection-name">{name}</span>
            </li>
            );
        })}
        </ul>
    );
}
