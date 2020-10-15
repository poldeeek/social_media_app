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
const notificationsRoutes = require('./routes/api/notifications');
const Friends = require('./models/Friends');
const User = require('./models/User');

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

    // send message to friends about user connection
    Friends.findOne({ user_id: uid }).then(resp => {
        resp.friends.forEach(friend => {
            io.in(friend).emit("online", uid);
        });
    })

    User.updateOne({
        _id: uid
    }, {
        online: true
    }).catch(err => console.log("Log in socket error", err))

    // Run when user disconnect
    socket.on('disconnect', async () => {

        // send message to friends about user disconnection
        Friends.findOne({ user_id: uid }).then(resp => {
            resp.friends.forEach(friend => {
                io.in(friend).emit("offline", uid);
            });
        })

        User.updateOne({
            _id: uid
        }, {
            online: false
        }).catch(err => console.log("Log out socket error", err))
    })
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










