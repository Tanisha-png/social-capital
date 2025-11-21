
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

    const getAvatar = (user, index) => {
        // Use _id, then id, then fallback seed
        const seed = user?._id || user?.id || `user-${index}`;
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
        seed
        )}`;
    };

    return (
        <ul className="connections-list">
        {connections.map((c, i) => (
            <li key={c._id || c.id || i}>
            <img
                src={getAvatar(c, i)}
                alt={`${c.firstName || "Unknown"} ${c.lastName || ""}`.trim()}
            />
            <span>
                {c.firstName || "Unknown"} {c.lastName || ""}
            </span>
            </li>
        ))}
        </ul>
    );
}
