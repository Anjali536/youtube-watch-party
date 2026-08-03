// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username:{
    type:String,
    required:true
    },

    socketId:{
    type:String,
    required:true
    },

    role:{
    type:String,
    enum:["host","moderator","participant"],
    default:"participant"
    },

    roomCode:{
    type:String
    }
    },

    {
    timestamps:true
});

module.exports=mongoose.model("User",userSchema);