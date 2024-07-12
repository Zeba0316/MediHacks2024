const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    name: {
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
    image: {
        name: { type: String, required: true, },
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
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
            comment: {
                type: String,
                required: true
            }
        }
    ]

})
const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;