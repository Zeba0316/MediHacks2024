const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    userImageName: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    imageSent: {
        type: Boolean,
        require: true
    },
    image: {
        name: { type: String, },
        data: { type: Buffer, },
        contentType: { type: String, },
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    comments: [
        {
            user: {
                type: String,
                required: true
            },
            imageUser: {
                type: String,
                require: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    likes: [
        {
            likedUser: {
                type:String
            }
        }
    ]

})
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;