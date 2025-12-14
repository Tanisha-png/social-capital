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
app.set("trust proxy", 1);
const server = http.createServer(app);
const herokuAppUrl =
  process.env.HEROKU_APP_URL ||
  "https://social-capital-1f13c371b2ba.herokuapp.com";

const isDev = process.env.NODE_ENV !== "production";
const frontendDevUrl = "http://localhost:5173";

// ---------------- CORS ----------------
const corsOptions = {
  origin: [frontendDevUrl, herokuAppUrl],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// ---------------- HELMET / CSP ----------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          herokuAppUrl,
          "https://api.dicebear.com",
          "https://*.herokuapp.com",
          "https://*.wp.com",
          "https://*.wordpress.com",
          "https://*.trekmate.org.uk",
          "https://res.cloudinary.com",
          "https://images.unsplash.com",
          "https://cdn.pixabay.com",
          "*",
        ],
        connectSrc: [
          "'self'",
          ...(isDev ? [frontendDevUrl, "ws://localhost:5173"] : []),
          "ws://localhost:3000",
          "wss://social-capital-1f13c371b2ba.herokuapp.com",
          herokuAppUrl,
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
        ],
        styleSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
        ],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      },
    },
  })
);

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ---------------- SOCKET.IO ----------------
export const io = new Server(server, { cors: corsOptions });
const onlineUsers = new Map();

export function notifyUser(userId, notification) {
  if (!userId) return;
  io.to(userId.toString()).emit("notification", notification);
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
  socket.join(socket.userId.toString());
  onlineUsers.set(socket.userId.toString(), socket.id);

  socket.on("send_message", async (data) => {
    const { senderId, receiverId, content } = data;
    if (!senderId || !receiverId || !content) return;

    try {
      const newMessage = await Message.create({
        sender: senderId,
        recipient: receiverId,
        text: content,
        read: false,
      });

      const populatedMessage = await newMessage.populate([
        { path: "sender", select: "firstName lastName avatar" },
        { path: "recipient", select: "firstName lastName avatar" },
      ]);

      const unreadCount = await Message.countDocuments({
        sender: senderId,
        recipient: receiverId,
        read: false,
      });

      const recipientSocket = onlineUsers.get(receiverId.toString());
      if (recipientSocket) {
        io.to(recipientSocket).emit("message:received", {
          senderId: senderId.toString(),
          unreadCount,
        });
        io.to(recipientSocket).emit("newMessage", {
          ...populatedMessage._doc,
          receiverId: receiverId.toString(),
        });
      }

      io.to(senderId.toString()).emit("newMessage", {
        ...populatedMessage._doc,
        receiverId: receiverId.toString(),
      });
    } catch (err) {
      console.error("Socket send_message error:", err);
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
const frontendDistPath = path.join(__dirname, "frontend", "dist");

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/health", (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendDistPath, "index.html"));
  });
} else {
  app.get("/", (_req, res) => res.json({ message: "API is operational." }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`✅ API listening on ${PORT}`)
);
