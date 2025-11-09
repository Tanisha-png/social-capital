

import { io } from "socket.io-client";

let socket;

export function initSocket(token, userId, onNotification) {
    if (!userId || !token) return;

    if (!socket) {
        socket = io("http://localhost:3000", {
            transports: ["websocket"],
            auth: { token },
        });
    }

    // Join the user room
    socket.emit("join", userId);

    // Listen for notifications
    socket.on("notification", (notif) => {
        console.log("New notification:", notif);
        if (typeof onNotification === "function") onNotification(notif);
    });

    return socket;
}

export default socket;
