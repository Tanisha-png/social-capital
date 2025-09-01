

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import messagesRoutes from "./routes/messageRoutes.js";
import searchRoutes from "./routes/search.js";

dotenv.config();
await connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true, credentials: true } });

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/search", searchRoutes);

// (Optional) simple test endpoint
app.get("/health", (_req, res) => res.json({ ok: true }));

// Serve frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`API listening on ${PORT}`));
