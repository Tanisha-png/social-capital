
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

    const getAvatar = (user) => {
        // Normalize ID
        const id = user?._id || user?.id;
        if (!id) return "/default-avatar.png"; // fallback

        // Encode to ensure valid URL
        return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(
        id
        )}`;
    };

    return (
        <ul className="connections-list">
        {connections.map((c) => (
            <li key={c._id || c.id}>
            <img
                src={getAvatar(c)}
                alt={`${c.firstName || ""} ${c.lastName || ""}`.trim() || "User"}
            />
            <span>
                {c.firstName || "Unknown"} {c.lastName || ""}
            </span>
            </li>
        ))}
        </ul>
    );
}
