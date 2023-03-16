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
module.exports = router;
