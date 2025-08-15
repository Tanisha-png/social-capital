// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";

// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import connectionRoutes from "./routes/connectionRoutes.js";
// import messageRoutes from "./routes/messageRoutes.js";
// import setupMessageSocket from "./sockets/messageSocket.js";


// dotenv.config();
// connectDB();





// // Load environment variables from .env BEFORE anything else
// require('dotenv').config();

// const path = require('path');
// const express = require('express');
// const logger = require('morgan');

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }
// });

// const app = express();

// // Connect to the database (this uses process.env.MONGO_URI)
// require('./db');

// // ...rest of your app setup...

// app.use(logger('dev'));
// // Serve static assets from the frontend's built code folder (dist)
// app.use(express.static(path.join(__dirname, '../frontend/dist')));
// // Note that express.urlencoded middleware is not needed
// // because forms are not submitted!
// app.use(express.json());

// // Check & verify token.  If so, add user payload to req.user
// app.use(require('./middleware/checkToken'));

// // API Routes
// app.use('/api/auth', require('./routes/auth'));

// // All routers below will have all routes protected
// app.use(require('./middleware/ensureLoggedIn'));

// app.use('/api/posts', require('./routes/posts'));

// // Use a "catch-all" route to deliver the frontend's production index.html
// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`The express app is listening on ${port}`);
// });

// app.use(cors());
// app.use(express.json());

// // routes
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/connections", connectionRoutes);
// app.use("/api/messages", messageRoutes);

// setupMessageSocket(io);

import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import logger from "morgan";
import userRoutes from "./routes/userRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import connectDB from "./config/db.js";
import checkToken from './middleware/checkToken.js';
import ensureLoggedIn from './middleware/ensureLoggedIn.js';

import authRoutes from "./routes/auth.js";
// Add other routes later: userRoutes, connectionRoutes, messageRoutes
// import userRoutes from "./routes/userRoutes.js";

import setupMessageSocket from "./sockets/messageSocket.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }
});

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (apply middleware)
app.use(checkToken);
app.use(ensureLoggedIn);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/messages", messageRoutes);

// app.use("/api/users", userRoutes); // add later

// Socket setup
setupMessageSocket(io);

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
