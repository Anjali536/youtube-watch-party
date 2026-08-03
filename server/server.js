require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socketHandler = require("./socket/socketHandler");
const { Server } = require("socket.io");
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

socketHandler(io);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});