import path from "path";
import jwt from "jsonwebtoken";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";
import Message from "./models/message.js";
import checkToken from "./middleware/checkToken.js";
void checkToken;

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";

dotenv.config();
await connectDB();

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);

const corsOptions = {
  origin: ["http://localhost:5173", "https://social-capital-1f13c371b2ba.herokuapp.com"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, contentSecurityPolicy: {
    directives: {
      // Keep existing directives, and ADD 'https://api.dicebear.com' to img-src
      imgSrc: ["'self'", "data:", "https://api.dicebear.com"],
      // Also need to allow websocket connection for socket.io
      connectSrc: ["'self'", "ws://localhost:3000", "wss://social-capital-1f13c371b2ba.herokuapp.com"],
    },
  },
}));
app.use(express.json());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ---------------- SOCKET.IO ----------------
export const io = new Server(server, { cors: corsOptions });
const onlineUsers = new Map();

// ✅ This is the helper we will use across the app
export function notifyUser(userId, notification) {
  if (!userId) return;

  // Send to user room
  io.to(userId.toString()).emit("notification", notification);

  // Also send to active socket if tracked
  const socketId = onlineUsers.get(userId.toString());
  if (socketId) io.to(socketId).emit("notification", notification);
}


io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Socket auth failed:", err);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id, "User:", socket.userId);

  // Join user's personal room
  socket.join(socket.userId.toString());
  onlineUsers.set(socket.userId.toString(), socket.id);

  console.log(`✅ User joined notification room: ${socket.userId}`);

  socket.on("sendMessage", async (data) => {
    const { senderId, recipientId, text } = data;
    if (!senderId || !recipientId || !text) return;

    try {
      const newMessage = await Message.create({
        sender: senderId,
        recipient: recipientId,
        text,
        read: false,
      });

      const recipientSocket = onlineUsers.get(recipientId.toString());
      if (recipientSocket) {
        io.to(recipientSocket).emit("newMessage", newMessage);
      }
    } catch (err) {
      console.error("Socket sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) onlineUsers.delete(userId);
    });
    console.log("👋 User disconnected:", socket.userId);
  });
});

app.use((req, _res, next) => {
  req.io = io;
  next();
});

const __dirname = path.resolve();
const frontendDistPath = path.join(__dirname, 'frontend', 'dist');


// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/health", (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
  });
} else {
  app.get("/", (_req, res) => res.json({ message: "API is operational." }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`✅ API listening on ${PORT}`)
);
