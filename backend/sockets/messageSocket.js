// import Message from "../models/Message.js";

// export default function setupMessageSocket(io) {
//     // map of userId -> socketId(s)
//     const online = new Map();

//     io.on("connection", (socket) => {
//         // client should emit "identify" with userId after connecting
//         socket.on("identify", (userId) => {
//             const prev = online.get(userId) || [];
//             online.set(userId, [...prev, socket.id]);
//             socket.userId = userId;
//         });

//         socket.on("join_room", (roomId) => {
//             socket.join(roomId);
//         });

//         socket.on("send_message", async (data) => {
//             // data: { sender, receiver, content }
//             try {
//                 const msg = await Message.create({
//                     sender: data.sender,
//                     receiver: data.receiver,
//                     content: data.content
//                 });

//                 // emit to receiver sockets if online
//                 const receiverSockets = online.get(String(data.receiver)) || [];
//                 receiverSockets.forEach(sid => io.to(sid).emit("receive_message", msg));

//                 // also emit ack to sender to update UI
//                 io.to(socket.id).emit("message_saved", msg);
//             } catch (err) {
//                 console.error("send_message error:", err);
//             }
//         });

//         socket.on("disconnect", () => {
//             // remove socket from online map
//             if (socket.userId) {
//                 const arr = online.get(socket.userId) || [];
//                 online.set(socket.userId, arr.filter(sid => sid !== socket.id));
//             }
//         });
//     });
// }


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
