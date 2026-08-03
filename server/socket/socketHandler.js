const User = require("../models/User");
const Room = require("../models/Room");

const socketHandler = (io) => {

    io.on("connection", (socket) => {
        console.log("User Connected :", socket.id);
        // ==========================
        // PERMISSION CHECK
        // ==========================
        const hasControlPermission = async (socketId) => {
            const user = await User.findOne({
                socketId
            });
            if (!user) {
                return false;
            }
            return (
                user.role === "host" ||
                user.role === "moderator"
            );
        };
        // ==========================
        // JOIN ROOM
        // ==========================

        socket.on("join-room", async ({ roomCode, username }) => {
            try {
                const room = await Room.findOne({ roomCode });
                if (!room) {
                    socket.emit("room-error", {
                        message: "Room Not Found"
                    });
                    return;
                }
                socket.join(roomCode);
                let user;
                const existingParticipants = await User.find({
                    roomCode
                });
                if (existingParticipants.length === 0) {
                    user = await User.create({
                        username,
                        socketId: socket.id,
                        roomCode,
                        role: "host"
                    });
                    room.hostId = user._id;
                    room.participants.push(user._id);
                    await room.save();
                } else {
                    user = await User.create({
                        username,
                        socketId: socket.id,
                        roomCode,
                        role: "participant"
                    });
                    room.participants.push(user._id);
                    await room.save();
                }
                    const participants = await User.find({
                        roomCode
                });

                io.to(roomCode).emit(
                    "participants-updated",
                    participants
                );
                socket.emit("room-data", {
                    videoId: room.videoId,
                    currentTime: room.currentTime,
                    isPlaying: room.isPlaying
                });
            }
            catch (err) {
                console.log(err);
            }
        });

        // ==========================
        // CHANGE VIDEO
        // ==========================

        socket.on("change-video", async ({ roomCode, videoId }) => {
            try {
                const allowed = await hasControlPermission(socket.id);
                if (!allowed) {
                    socket.emit("permission-denied");
                    return;
                }
                const room = await Room.findOne({
                    roomCode
                });
                if (!room) return;
                room.videoId = videoId;
                room.currentTime = 0;
                room.isPlaying = false;
                await room.save();
                io.to(roomCode).emit("video-changed", {
                    videoId
                });
            }

            catch (err) {
                console.log(err);
            }

        });
        // ==========================
        // PLAY VIDEO
        // ==========================

        socket.on("play-video", async ({ roomCode }) => {
            try {
                const allowed = await hasControlPermission(socket.id);
                if (!allowed) {
                    socket.emit("permission-denied");
                    return;
                }
                await Room.findOneAndUpdate(
                    { roomCode },
                    {
                        isPlaying: true
                    }
                );
                socket.to(roomCode).emit("play-video");
            }

            catch (err) {
                console.log(err);
            }
        });

        // ==========================
        // PAUSE VIDEO
        // ==========================

        socket.on("pause-video", async ({ roomCode }) => {
            try {
                const allowed = await hasControlPermission(socket.id);
                if (!allowed) {
                    socket.emit("permission-denied");
                    return;
                }
                await Room.findOneAndUpdate(
                    { roomCode },
                    {
                        isPlaying: false
                    }
                );
                socket.to(roomCode).emit("pause-video");
            }
            catch (err) {
                console.log(err);
            }
        });

        // ==========================
        // SEEK VIDEO
        // ==========================

        socket.on("seek-video", async ({ roomCode, currentTime }) => {
            try {
                const allowed = await hasControlPermission(socket.id);
                if (!allowed) {
                    socket.emit("permission-denied");
                    return;
                }
                await Room.findOneAndUpdate(
                    { roomCode },
                    {
                        currentTime
                    }
                );
                socket.to(roomCode).emit("seek-video", {
                    currentTime
                });
            }
            catch (err) {
                console.log(err);
            }
        });
        // ==========================
        // MAKE MODERATOR
        // ==========================
        socket.on("make-moderator", async ({ roomCode, userId }) => {
            try {
                const requester = await User.findOne({
                    socketId: socket.id
                });
                if (!requester || requester.role !== "host") {
                    socket.emit("permission-denied");
                    return;
                }
                const targetUser = await User.findById(userId);
                if (!targetUser) {
                    socket.emit("user-not-found");
                    return;
                }
                if (targetUser.roomCode !== roomCode) {
                    return;
                }
                targetUser.role = "moderator";
                await targetUser.save();
                const participants = await User.find({
                    roomCode
                });
                io.to(roomCode).emit(
                    "participants-updated",
                    participants
                );
            }
            catch (err) {
                console.log(err);
            }
        });

        // ==========================
        // REMOVE PARTICIPANT
        // ==========================

        socket.on("remove-participant", async ({ roomCode, userId }) => {
            try {
                const requester = await User.findOne({
                    socketId: socket.id
                });
                if (!requester || requester.role !== "host") {
                    socket.emit("permission-denied");
                    return;
                }
                const targetUser = await User.findById(userId);
                if (!targetUser) return;
                if (targetUser.role === "host") return;
                const room = await Room.findOne({
                    roomCode
                });
                if (!room) return;
                room.participants = room.participants.filter(
                    (id) =>
                        id.toString() !== userId
                );
                await room.save();
                await User.deleteOne({
                    _id: userId
                });
                io.to(targetUser.socketId).emit("removed");
                const targetSocket = io.sockets.sockets.get(
                    targetUser.socketId
                );
                if (targetSocket) {
                    setTimeout(() => {
                        targetSocket.leave(roomCode);
                        targetSocket.disconnect(true);
                    }, 500);
                }
                const participants = await User.find({
                    roomCode
                });
                io.to(roomCode).emit(
                    "participants-updated",
                    participants
                );
            }
            catch (err) {
                console.log(err);
            }
        });

        // ==========================
        // DISCONNECT
        // ==========================

        socket.on("disconnect", async () => {

            console.log("User Disconnected :", socket.id);

            try {

                const user = await User.findOne({

                    socketId: socket.id

                });

                if (!user) return;

                const room = await Room.findOne({

                    roomCode: user.roomCode

                });

                if (room) {

                    room.participants = room.participants.filter(

                        (id) =>

                            id.toString() !== user._id.toString()

                    );

                    if (

                        room.hostId &&

                        room.hostId.toString() ===

                        user._id.toString()

                    ) {

                        if (room.participants.length > 0) {

                            room.hostId = room.participants[0];

                            await User.findByIdAndUpdate(

                                room.hostId,

                                {

                                    role: "host"

                                }

                            );

                        }

                        else {

                            room.hostId = null;

                        }

                    }

                    await room.save();

                    const participants = await User.find({

                        roomCode: user.roomCode

                    });

                    io.to(user.roomCode).emit(

                        "participants-updated",

                        participants

                    );

                }

                await User.deleteOne({

                    socketId: socket.id

                });

            }

            catch (err) {

                console.log(err);

            }

        });

    });

};

module.exports = socketHandler;