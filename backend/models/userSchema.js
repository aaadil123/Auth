const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    otp: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("User", userSchema);