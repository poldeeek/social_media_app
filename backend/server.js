require('dotenv').config()
const http = require('http');
const express = require("express");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routes
const userRoutes = require('./routes/api/users')
const authRoutes = require('./routes/api/auth')
const friendsRoutes = require('./routes/api/friends')
const invitationsRoutes = require('./routes/api/invitations')
const postsRoutes = require('./routes/api/posts')
const commentsRoutes = require('./routes/api/comments')
const notificationsRoutes = require('./routes/api/notifications')

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

    socket.join(uid);
})

// middleware to pass the io object into the routes
app.use((req, res, next) => {
    res.io = io;
    next();
})

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/invitations', invitationsRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/notifications', notificationsRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`))










