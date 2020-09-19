require('dotenv').config()
const http = require('http');
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Pairs _id: socket when user connect with socket
const users_sockets = {};

// Routes
const userRoutes = require('./routes/api/users')
const authRoutes = require('./routes/api/auth')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true, preflightContinue: true }));
app.use(cookieParser());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    () => { console.log("DB connected.") })

// Run socket when client connects
io.on('connection', socket => {
    const uid = socket.handshake.query.userID;

    socket.on('start', () => {
        // room for notifications
        socket.join(`notifications_${uid}`);

        // room for notifications about new messages
        socket.join(`unSeenMessage_${uid}`);

        // room for chat between users
        socket.join(`chat_${uid}`);
    })
})

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))










