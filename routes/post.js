const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// Publication route

router.post('/publication', async (req, res) => {
    const {title, description, category, subCategory, price} = req.body;
        const newPost = new Post({
            title: title,
            description: description,
            category: category,
            subCategory: subCategory,
            price: price,
    })
        await newPost.save();
        res.json('post created');
});

//delete post route

router.delete("/delete-post/:id", async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json("Post deleted");
});


// read all post route

router.get("/read-all-posts", async (req, res) => {
    const findPosts = await Post.find();
    if (findPosts) {
        res.json(findPosts)
    } else {
        res.json("pas bien")
    }
})

// read one post route 

router.get("/read-one-post/:id", async (req, res) => {
    const findPost = await Post.findById(req.params.id);
    if (findPost) {
        res.json(findPost)
    } else {
        res.json("pas bien")
    }
})