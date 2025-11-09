
export default function setupMessageSocket(io) {
    io.on("connection", (socket) => {
        console.log("✅ User connected:", socket.id);

        // User joins their designated room
        socket.on("join", (userId) => {
            if (!userId) return;
            socket.join(userId.toString());
            console.log(`🔐 User joined room: ${userId}`);
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });
}

