
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
  if (!connections || !connections.length) return <p>No connections yet.</p>;

  // Generate a valid avatar URL for DiceBear
    const getAvatar = (user, index) => {
        const seed = user?._id || user?.id || `connection-${index}`;
        console.log(`[ConnectionsList] Avatar seed for user:`, user, `→`, seed);
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
            seed
        )}`;
    };

    // Generate a display name safely
    const getDisplayName = (user) => {
        const first = user?.firstName || user?.name || "Unknown";
        const last = user?.lastName || "";
        return `${first} ${last}`.trim();
    };

    return (
        <ul className="connections-list">
        {connections.map((user, i) => (
            <li key={user._id || user.id || i} className="connection-item">
            <img
                src={getAvatar(user, i)}
                alt={getDisplayName(user)}
                className="connection-avatar"
                onError={(e) => {
                // Fallback if DiceBear fails
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
