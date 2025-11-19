

// import { io } from "socket.io-client";
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// let socket;

// export function initSocket(token, userId, onNotification) {
//     if (!userId || !token) return null;

//     if (!socket) {
//         socket = io(`${BACKEND_URL}`, {
//             transports: ["websocket"],
//             auth: { token },
//         });
//     }

//     // Join the user room
//     socket.emit("join", userId);

//     // Listen for notifications
//     socket.on("notification", (notif) => {
//         console.log("New notification:", notif);
//         if (typeof onNotification === "function") onNotification(notif);
//     });

//     return socket;
// }

// export default socket;

// socket.js
// socket.js
import { io } from "socket.io-client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let socket = null;

export function initSocket(token, userId) {
    if (!token || !userId) return null;

    if (!socket) {
        socket = io(BACKEND_URL, {
            transports: ["websocket"],
            auth: { token },
        });
    }

    socket.emit("join", userId);
    return socket;
}

export function getSocket() {
    return socket;
}

export default { initSocket, getSocket };
