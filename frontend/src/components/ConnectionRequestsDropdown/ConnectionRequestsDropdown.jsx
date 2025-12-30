import { useState, useRef, useEffect } from "react";
import { useFriendRequests } from "../../context/FriendRequestContext";

export default function ConnectionRequestsDropdown() {
    const { requests, count, accept, decline } = useFriendRequests();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setOpen(false);
        }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
        <button
            className="nav-notifications relative"
            onClick={() => setOpen((o) => !o)}
            title="Connection Requests"
        >
            👥
            {count > 0 && <span className="notification-badge">{count}</span>}
        </button>

        {open && (
            <div className="notifications-dropdown">
            {requests.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm text-center">
                No connection requests
                </p>
            ) : (
                requests.map((r) => (
                <div key={r._id} className="dropdown-item">
                    <img
                    src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${r._id}`}
                    alt={r.firstName || "User"}
                    />

                    <div className="notification-text">
                    <strong>
                        {r.firstName || r.name || "User"} {r.lastName || ""}
                    </strong>
                    <span className="text-sm text-gray-500">
                        wants to connect
                    </span>

                    <div
                        style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "6px",
                        }}
                    >
                        <button
                        onClick={() => accept(r._id)}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                        >
                        Accept
                        </button>
                        <button
                        onClick={() => decline(r._id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                        >
                        Decline
                        </button>
                    </div>
                    </div>
                </div>
                ))
            )}
            </div>
        )}
        </div>
    );
}
