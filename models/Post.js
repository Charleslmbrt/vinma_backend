const mongoose = require("mongoose");

const Post = mongoose.model("Post", {
    title: String,
    description: String,
    category: String,
    subCategory: String,
    price: Number,
    pictures: {
        default: [],
        type: Array,
    },
    owner: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    options: {
        color: String,
        brand: String,
        state: String,
        dimensions: String,
    },
});

module.exports = Post;