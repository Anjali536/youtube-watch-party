const Room = require("../models/Room");
const generateRoomCode = require("../utils/generateRoomCode");

const createRoom = async (req, res) => {

    try {
        let roomCode;
        let existingRoom;
        do {
            roomCode = generateRoomCode();
            existingRoom = await Room.findOne({ roomCode });
        } while (existingRoom);

        const room = await Room.create({
            roomCode
        });

        return res.status(201).json({
            success: true,
            message: "Room Created Successfully",
            room
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    createRoom
};