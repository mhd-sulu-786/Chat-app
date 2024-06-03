const express = require("express");
const http = require('http');
const cors = require("cors");
const socketIO = require('socket.io');

// Initialize express app
const app = express();

// Middleware
app.use(cors());

// Create server
const server = http.createServer(app);

// Socket.IO setup
const io = socketIO(server, {
    cors: {
        origin: "https://chat-app-soketio.vercel.app/chat",
        methods: ["GET", "POST"]
    }
});

// Store active users
let users = [];

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("message", (data) => {
        io.emit("messageResponse", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typingResponse", data);
    });

    socket.on("newUser", (data) => {
        users.push({ ...data, socketID: socket.id });
        io.emit("newUserResponse", users);
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter((user) => user.socketID !== socket.id);
        io.emit("newUserResponse", users);
    });
});

// Basic routes
app.get('/', (req, res) => {
    res.send("Server Running");
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello" });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
