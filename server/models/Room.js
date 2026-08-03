const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        roomCode: {
            type: String,
            required: true,
            unique: true
        },

        hostId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        videoId: {
            type: String,
            default: ""
        },

        currentTime: {
            type: Number,
            default: 0
        },

        isPlaying: {
            type: Boolean,
            default: false
        },

        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Room", roomSchema);