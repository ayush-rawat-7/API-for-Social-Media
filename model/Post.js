const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },
    description: {
        type: String,
        max: 700
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    comment:{
        type:Array,
        default:[{}]
    }
},
    { timestamps: true }
)

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;