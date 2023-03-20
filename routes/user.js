const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
require("dotenv").config();

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Convert buffer as base64 format
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

//registration route

router.post("/signup", async (req, res) => {
  try {
    const { name, lastName, nickName, email, address, phoneNumber, password } =
      req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      res.json("Already exists");
    } else if (name && lastName && email && password) {
      //handle pasword
      const salt = uid2(120);
      const hashed = SHA256(password + salt).toString(encBase64);

      // admin
      const admin = 0;

      const newUser = new User({
        name: name,
        lastName: lastName,
        nickName: nickName,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        salt: salt,
        password: hashed,
        admin: admin,
      });

      const result = await cloudinary.uploader.upload(
        convertToBase64(req.files.profilePicture),
        {
          folder: `avatar/${newUser._id}`,
        }
      );

      newUser.profilePicture = result;

      await newUser.save();
      res.json({
        name: name,
        lastName: lastName,
        nickName: nickName,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        profilePicture: result,
      });
    } else {
      res.status(400).json("All fields are required");
    }
  } catch (error) {
    res.status(400).json(err(error.message));
  }
});

// login route

router.put("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const user = await User.findOne({ email: email });

      if (user) {
        const checkPassword = SHA256(password + user.salt).toString(encBase64);

        if (user.password === checkPassword) {
          const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          });

          res.status(200).json({
            userId: user._id,
            token: token,
          });
        } else {
          res.json("Unauthorized");
        }
      } else {
        res.json("Wrong user or password");
      }
    } else {
      res.json("All fields are required");
    }
  } catch (error) {
    res.status(400).json(err(error.message));
  }
});

//delete route

router.delete("/delete-user/:id", auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json("User deleted");
});

//modification route

router.put("/modification/:id", auth, async (req, res) => {
  const { nickName, email, address, phoneNumber, profilePicture, password } =
    req.body;

  const userInfos = await User.findById(req.params.id);

  if (userInfos) {
    if (req.body.nickName) {
      userInfos.nickName = nickName;
    }
    if (req.body.email) {
      userInfos.email = email;
    }
    if (req.body.address) {
      userInfos.address = address;
    }
    if (req.body.phoneNumber) {
      userInfos.phoneNumber = phoneNumber;
    }
    if (req.body.profilePicture) {
      userInfos.profilePicture = profilePicture;
    }
    if (req.body.password) {
      const newPassword = SHA256(password + userInfos.salt).toString(encBase64);
      userInfos.password = newPassword;
    }

    await userInfos.save();

    res.json("User modified");
  } else {
    res.json("User not found");
  }
});

router.get("/userinfos/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.json("user not found");
  }
});

module.exports = router;
