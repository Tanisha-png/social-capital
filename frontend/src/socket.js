
import { io } from "socket.io-client";

// Connect to the backend API port (3000)
const socket = io("http://localhost:3000", {
    autoConnect: false,
    transports: ["websocket"], // faster & avoids polling errors
});

export default socket;