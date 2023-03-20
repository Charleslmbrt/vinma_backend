const express = require("express");
const router = express.Router();

//import models
const Post = require("../models/Post");
const User = require("../models/User");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Convert buffer as base64 format
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

const auth = require("../middleware/auth");

// Publication route
router.post("/publication", auth, async (req, res) => {
  try {
    const { title, description, category, subCategory, price } = req.body;

    if (title && description && category && subCategory && price) {
      const newPost = new Post({
        title: title,
        description: description,
        category: category,
        subCategory: subCategory,
        price: price,
      });

      const result = await cloudinary.uploader.upload(
        convertToBase64(req.files.images),
        {
          folder: `posts/${newPost._id}`,
        }
      );

      newPost.images = result;

      await newPost.save();

      res.json(newPost);
    } else {
      res.status(400).json(err("Parameters missing"));
    }
  } catch (error) {
    res.status(400).json(err(error.message));
  }
});

//delete post route
router.delete("/delete-post/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post) {
      const userId = req.user._id;
      const postUserId = post.owner;

      if (String(userId) === String(postUserId)) {
        await Post.findByIdAndDelete(req.params.id);

        const user = await User.findById(userId);

        let arrayPosts = user.posts;
        let indexOfPost = arrayPosts.indexOf(req.params.id);
        arrayPosts.splice(indexOfPost, 1);

        await User.findByIdAndUpdate(userId, { posts: arrayPosts });
        res.json("Post deleted");
      } else {
        res.status(400).json(err("Unauthorized"));
      }
    } else {
      res.status(400).json("Post not found");
    }
  } catch (error) {
    res.status(400).json(err(error.message));
  }
});

// read all post route

router.get("/read-all-posts", async (req, res) => {
  try {
    const findPosts = await Post.find({}).populate({
      path: "owner",
      select: "nickName profilePicture",
    });
    if (findPosts) {
      res.json(findPosts);
    } else {
      res.json("Posts not found");
    }
  } catch (error) {
    res.status(400).json(err(error.message));
  }
});

// read one post route

router.get("/read-one-post/:id", async (req, res) => {
  try {
    if (req.params.id) {
      const findPost = await Post.findById(req.params.id).populate({
        path: "owner",
        select: "nickName profilePicture",
      });
      if (findPost) {
        res.json(findPost);
      } else {
        res.json("Post not found");
      }
    } else {
      res.status(400).json(err("Missing post id"));
    }
  } catch (error) {
    res.status(400).json(err(error.message));
  }
});

//modification route

router.put("/postModification/:id", auth, async (req, res) => {
  const postInfos = await Post.findById(req.params.id);

  if (postInfos) {
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
    res.json("Post modified");
  } else {
    res.json("Post not found");
  }
});

module.exports = router;
