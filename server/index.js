// Import Modules
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

// Create Server
const app = express();
const http = require("http").createServer(app);

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Initialize Socket.io
const io = require("socket.io")(http, {
    cors: {
        origin: ["http://localhost:3000", " https://8945-103-180-245-250.ngrok-free.app"],
    },
});

// Declare constants
const PORT = process.env.PORT || 5000;
const socketList = {};

app.get("/health-check", (req, res) => {
    res.status(200).json({ success: true, message: "Server is running" });
});

app.get("/", (req, res) => {
    res.status(200).json({ success: true });
});

io.on("connection", socket => {
    console.log("A user connected with id: ", socket.id);

    // User Disconnects from a room
    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("user disconnected");
    });

    // User Joins a Room
    socket.on("[SERVER]-JOIN-ROOM", ({ roomId, userName }) => {
        socket.join(roomId);
        socketList[socket.id] = { userName, video: true, audio: true };

        console.log(socketList);

        // Broadcast to all users in the room that a user has joined the room
        io.sockets.in(roomId).clients((error, clients) => {
            if (error) {
                console.log(err);
                io.sockets.in(roomId).emit("[SERVER]-ERROR-OCCURRED-USER-EXISTS", { error: true });
            }

            const users = clients.map(client => {
                return { userId: client, information: socketList[client] };
            });

            socket.broadcast.to(roomId).emit("[CLIENT]-USER-JOINED", users);
        });
    });

    // Check if the user is already in the room
    socket.on("[SERVER]-CHECK-USER", ({ roomId, userName }) => {
        let userExists = false;

        // Match user name with the current users in the room
        try {
            io.sockets.in(roomId).clients((error, clients) => {
                if (error) {
                    console.log(error);
                    io.sockets.in(roomId).emit("[SERVER]-ERROR-OCCURRED-USER-EXISTS", { error: true });
                }

                clients.forEach(client => {
                    if (socketList[client].userName === userName) {
                        userExists = true;
                    }
                });

                socket.emit("[SERVER]-ERROR-OCCURRED-USER-EXISTS", userExists);
            });
        } catch (error) {
            console.log(error);
            socket.emit("[SERVER]-ERROR-OCCURRED-USER-EXISTS", userExists);
        }
    });

    // Call user
    socket.on("[SERVER]-CALL-USER", ({ userToCall, from, signal }) => {
        io.to(userToCall).emit("[CLIENT]-RECIEVE-CALL", {
            signal,
            from,
            information: socketList[socket.id],
        });
    });

    // Recieve call
    socket.on("[SERVER]-ACCEPT-CALL", ({ signal, to }) => {
        io.to(to).emit("[CLIENT]-CALL-ACCEPTED", {
            signal,
            answerId: socketList[socket.id],
        });
    });

    // Send Message
    socket.on("[SERVER]-SEND-MESSAGE", ({ roomId, message, sender }) => {
        console.log(roomId, message, sender);
        io.sockets.in(roomId).emit("[CLIENT]-RECEIVE-MESSAGE", { message, sender });
    });

    // Leave Room
    socket.on("[SERVER]-LEAVE-ROOM", ({ roomId, userName }) => {
        delete socketList[socket.id];

        socket.broadcast.to(roomId).emit("[CLIENT]-USER-LEFT", { userId: socket.id, userName });

        io.sockets.sockets[socket.id].leave(roomId);
    });

    // Toggle Video Audio
    socket.on("[SERVER]-TOGGLE-VIDEO-AUDIO", ({ roomId, switchTarget }) => {
        if (switchTarget === "video") {
            socketList[socket.id].video = !socketList[socket.id].video;
        } else {
            socketList[socket.id].audio = !socketList[socket.id].audio;
        }

        socket.broadcast.to(roomId).emit("[CLIENT]-TOGGLE-VIDEO-AUDIO", { userId: socket.id, switchTarget });
    });
});

http.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});
