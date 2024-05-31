const express = require("express");
const cors = require("cors"); // Import the cors middleware
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors"); 
const path = require('path');

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
connectDB();
const app = express();

// Apply CORS middleware for HTTP-based API endpoints
app.use(cors({
    origin: ['https://panchayat-frn1.onrender.com',"http://localhost:5173"], // Replace with your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow sending of cookies and session tokens
}));

app.use(express.json()); // to accept json data 

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
    res.send("Hello user");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => console.log(`server started on PORT ${PORT}`.yellow.bold));
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: ["https://216.24.57.4", "https://216.24.57.252","http://localhost:5173"], // CORS settings for Socket.IO
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"],
        credentials: true
    },
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        console.log("setup received for user:", userData._id);
        socket.join(userData._id);
        socket.emit("connected");
    });

    socket.on('join chat', (room) => {
        console.log("join chat received for room:", room);
        socket.join(room);
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        console.log("new message received:", newMessageReceived);

        if (!newMessageReceived.chat) {
            return console.log('newMessageReceived.chat not defined');
        }

        var chat = newMessageReceived.chat;

        if (!chat.users) {
            return console.log('chat.users not defined');
        }

        chat.users.forEach(user => {
            if (user === newMessageReceived.sender._id) return;

            console.log("emitting message to user:", user);
            socket.to(user).emit("message received", newMessageReceived);
        });
    });

    socket.off('setup', () => {
        console.log('user disconnected');
        socket.leave(userData._id);
    });
});
