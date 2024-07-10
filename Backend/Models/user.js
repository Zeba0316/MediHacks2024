const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: {
        type: String,
        required: true
    },
    image: {
        name: { type: String, required: true, unique: true },
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
    },
    stage: {
        type: String,
    },
    groups: [{
        type: String,
    }],
    friendRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    sentFriendRequest: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ]

});
const User = mongoose.model("User", userSchema);
module.exports = User;