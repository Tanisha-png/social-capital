
// backend/sockets/messageSocket.js
export default function setupMessageSocket(io) {
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // Example: receive a message from client
        socket.on("sendMessage", (data) => {
            console.log("Received message:", data);
            // Broadcast to all connected clients
            io.emit("receiveMessage", data);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}
