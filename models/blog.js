const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created: {type: Date, default: Date.now}  
})

const Blog = mongoose.model("Blog", blogSchema)
module.exports = Blog