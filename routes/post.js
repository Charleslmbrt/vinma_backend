const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

// Publication route

router.post('/publication', async (req, res) => {
    const {title, description, category, subCategory, price, images} = req.body;

    //handle profilePicture
    const image1 = images[0];
    const publicId1 = title + '1';
    const image2 = images[1];
    const publicId2 = title + '2';
    const image3 = images[2];
    const publicId3 = title + '3';
    const image4 = images[3];
    const publicId4 = title + '4';
    let imageUrl2 = '';
    let imageUrl3 = '';
    let imageUrl4 = '';

    cloudinary.uploader.upload(image1, {public_id: publicId1})
    const imageUrl1 = cloudinary.url(publicId1, {});

    if (image2){
        cloudinary.uploader.upload(image2, {public_id: publicId2})
        imageUrl2 = cloudinary.url(publicId2, {});
    }
    
    if (image3){
        cloudinary.uploader.upload(image3, {public_id: publicId3})
        imageUrl3 = cloudinary.url(publicId3, {});
    }
    if (image4){
        cloudinary.uploader.upload(image4, {public_id: publicId4})
        imageUrl4 = cloudinary.url(publicId4, {});
    }
    
        const newPost = new Post({
            title: title,
            description: description,
            category: category,
            subCategory: subCategory,
            price: price,
            images: [imageUrl1, imageUrl2, imageUrl3, imageUrl4]
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

//modification route

router.put("/postModification/:id", async (req, res) => {
    const postInfos = await Post.findById(req.params.id);
    console.log(postInfos)
    if (postInfos){
        if (req.body.title) {
            postInfos.title = req.body.title;
        }
        if (req.body.description) {
            postInfos.description = req.body.description;
        }
        if (req.body.subCategory) {
            postInfos.subCategory = req.body.subCategory;
        }
        if (req.body.category) {
            postInfos.category = req.body.category;
        }
        if (req.body.price) {
            postInfos.price = req.body.price;
        }
        

        await postInfos.save();
        res.json("post modified");
    } else {
        res.json("Missing required fields to post");
        console.log("hello word")
    }
})

module.exports = router;