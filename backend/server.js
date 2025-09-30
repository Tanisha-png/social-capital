
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";
import posts from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
await connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
export const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room: ${userId}`);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// Middleware
app.use(
  helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }) // allow loading images
);
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// ✅ Attach io to all requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Allow CORS specifically for /uploads
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET,HEAD");
    next();
  },
  express.static(path.join(process.cwd(), "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", posts);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);


// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`API listening on ${PORT}`));
