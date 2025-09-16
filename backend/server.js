import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import messagesRoutes from "./routes/messageRoutes.js";
import searchRoutes from "./routes/search.js";
import posts from "./routes/posts.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

// ⚡ ESM __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect DB
await connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: true, credentials: true } });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their personal room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

// Middleware
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ✅ Serve uploads (only once, consistent path)
app.use("/uploads", express.static(join(process.cwd(), "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/posts", posts);

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Serve frontend
app.use(express.static(join(__dirname, "../frontend/dist")));
app.get("*", (req, res) =>
  res.sendFile(join(__dirname, "../frontend/dist/index.html"))
);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`API listening on ${PORT}`));
