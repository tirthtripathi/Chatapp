const express = require("express");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors") 
const path = require('path');

const {notFound, errorHandler} =require("./middleware/errorMiddleware")

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes")
const messegeRoutes = require("./routes/messageRoutes")

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data 

app.use('/api/user', userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message', messegeRoutes);


app.get('/', (req, res)=>{
        res.send("Hello user")
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8000

const server = app.listen(PORT, console.log(`server started on PORT ${PORT}`.yellow.bold));
const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin: ["http://216.24.57.4","http://216.24.57.252"],
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

    socket.on('typing',(room) => socket.in(room).emit("typing"));
    socket.on('stop typing',(room) => socket.in(room).emit("stop typing"));

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

    socket.off('setup',() => {
        console.log('user disconected');
        socket.leave(userData._id)
    });
});
