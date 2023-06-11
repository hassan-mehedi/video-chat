const express = require("express");
const app = express();
const http = require("http").createServer(app);
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const PORT = process.env.PORT || 5000;

app.get("/health-check", (req, res) => {
    res.status(200).json({ success: true });
});

app.get("/", (req, res) => {
    res.status(200).json({ success: true });
});

io.on("connection", socket => {
    console.log("A user connected");

    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("user disconnected");
    });

    socket.on("client-connect", message => {
        console.log(message);

        socket.emit("server-connect", "Hello from server");
    });
});

http.listen(PORT, () => {
    console.log(`Server is running on  http://localhost:${PORT}`);
});
