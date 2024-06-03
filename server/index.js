const express = require("express");
const http = require('http');
const cors = require("cors");
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');

// Initialize express app
const app = express();

// Middleware
app.use(cors());

// MongoDB connection
const mongoURI = 'mongodb+srv://muhammadsulaimant367:gHHhZ9rtdVM53UGq@cluster0.odiivk8.mongodb.net/chatapp';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

// Create server
const server = http.createServer(app);

// Socket.IO setup
const io = socketIO(server, {
    cors: {
        origin: "https://chat-app-soketio.vercel.app/",
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("message", async (data) => {
        const message = new Message(data);
        await message.save();
        io.emit("messageResponse", data);
    });

    socket.on("typing", (data) => {
        socket.broadcast.emit("typingResponse", data);
    });

    socket.on("newUser", async (data) => {
        const user = new User({ ...data, socketID: socket.id });
        await user.save();
        const users = await User.find();
        io.emit("newUserResponse", users);
    });

    socket.on('disconnect', async () => {
        console.log('🔥: A user disconnected');
        await User.deleteOne({ socketID: socket.id });
        const users = await User.find();
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
