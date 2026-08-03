const generateRoomCode = () => {

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let roomCode = "";
    for (let i = 0; i < 6; i++) {

        const randomIndex = Math.floor(Math.random() * characters.length);
        roomCode += characters[randomIndex];
    }

    return roomCode;

};

module.exports = generateRoomCode;