
import React from "react";
import "./ConnectionsList.css";

export default function ConnectionsList({ connections }) {
    if (!connections || !connections.length) return <p>No connections yet.</p>;

    return (
      <ul className="connections-list">
        {connections.map((c) => (
          <li key={c._id}>
            <img
              // src={
              // c.profileImage
              //     ? `${window.location.origin}${c.profileImage}`
              //     : "/default-avatar.png"
              // }
              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.id}`}
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

