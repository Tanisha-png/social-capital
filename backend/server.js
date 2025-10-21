
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import posts from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";

dotenv.config();
await connectDB();

const app = express();
const server = http.createServer(app);

// --- CORS GLOBAL CONFIG ---
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// --- SECURITY & BODY PARSING ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// --- SOCKET.IO ---
export const io = new Server(server, {
  cors: corsOptions,
});

const onlineUsers = new Map(); // ✅ store userId => socket.id

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit("userOnline", userId); // ✅ broadcast online
      socket.join(userId);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(userId);
        io.emit("userOffline", userId); // ✅ broadcast offline
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

// Attach socket.io instance to requests
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", posts);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", connectionRoutes);

// --- HEALTH CHECK ---
app.get("/health", (_req, res) => res.json({ ok: true }));

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`✅ API listening on ${PORT}`));
