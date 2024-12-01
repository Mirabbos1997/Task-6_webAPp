
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const setupCollaborationSocket = require("./sockets/collaboration");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const presentationsRouter = require("./routes/presentations");
const slidesRouter = require("./routes/slides");
const usersRouter = require("./routes/users");

app.use("/api/presentations", presentationsRouter);
app.use("/api/slides", slidesRouter);
app.use("/api/users", usersRouter);

// Setup WebSocket
setupCollaborationSocket(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
