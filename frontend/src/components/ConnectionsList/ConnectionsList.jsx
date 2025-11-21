
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

// Helper: generate a fallback seed for users without IDs
const generateSeed = (user, index) => {
  // Use first+last name if available
    const nameSeed = `${user.firstName || ""}${user.lastName || ""}`.trim();
    if (nameSeed) return encodeURIComponent(nameSeed);

    // Fallback: use index to get a consistent but unique seed
    return `user-${index}`;
    };

    export default function ConnectionsList({ connections }) {
    if (!connections || !connections.length) return <p>No connections yet.</p>;

    const getAvatar = (user, index) => {
        // Prefer _id, then id
        const id = user?._id || user?.id;
        const seed = id ? id : generateSeed(user, index);
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
