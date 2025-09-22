// import React, { useState, useEffect } from "react";
// import * as authService from "../../services/authService";
// import "./ConnectionsList.css";

// export default function ConnectionsList({ userId }) {
//     const [connections, setConnections] = useState([]);

//     useEffect(() => {
//         async function fetchConnections() {
//         if (!userId) return;
//         const data = await authService.getConnections(userId);
//         setConnections(data);
//         }
//         fetchConnections();
//     }, [userId]);

//     return (
//         <div className="connections-list">
//         <h3>Connections</h3>
//         {connections.length === 0 ? (
//             <p>No connections yet.</p>
//         ) : (
//             <ul>
//             {connections.map((c) => (
//                 <li key={c._id}>
//                 <img src={c.profileImage || "/default-profile.png"} alt="" />
//                 <span>
//                     {c.firstName} {c.lastName}
//                 </span>
//                 </li>
//             ))}
//             </ul>
//         )}
//         </div>
//     );
// }

// import React, { useState, useEffect } from "react";
// import { getToken } from "../../services/authService";
// import "./ConnectionsList.css";

// export default function ConnectionsList({ userId }) {
//     const [connections, setConnections] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         let isMounted = true;

//         async function fetchConnections() {
//         if (!userId) return;
//         try {
//             const token = getToken();
//             const res = await fetch(`/api/users/${userId}/connections`, {
//             headers: { Authorization: `Bearer ${token}` },
//             });
//             if (!res.ok) throw new Error("Failed to fetch connections");
//             const data = await res.json();

//             if (isMounted) setConnections(data);
//         } catch (err) {
//             console.error("Connections fetch error:", err);
//         } finally {
//             if (isMounted) setLoading(false);
//         }
//         }

//         fetchConnections();

//         return () => {
//         isMounted = false;
//         };
//     }, [userId]);

//     if (loading) return <p>Loading connections...</p>;
//     if (!connections.length) return <p>No connections yet.</p>;

//     return (
//         <ul className="connections-list">
//         {connections.map((c) => (
//             <li key={c._id}>
//             <img
//                 src={c.profileImage || "/default-avatar.png"}
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

    return (
        <ul className="connections-list">
        {connections.map((c) => (
            <li key={c._id}>
            <img
                src={
                c.profileImage
                    ? `${window.location.origin}${c.profileImage}`
                    : "/default-avatar.png"
                }
                alt={`${c.firstName} ${c.lastName}`}
                onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
            />
            <span>
                {c.firstName} {c.lastName}
            </span>
            </li>
        ))}
        </ul>
    );
}

