const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { SHA256 } = require("crypto-js");
const uid2 = require("uid2");
require('dotenv').config()


const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });


//registration route

router.post("/registration", async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    const {name, lastName, nickName, email, address, phoneNumber, profilePicture, password, admin, token} = req.body;

    if (user) {
        res.json("Already exists");
    } else if (name && lastName && email && password) {

        //handle pasword
        const salt = uid2(120)
        const hashed = SHA256(password + salt);
        

        //handle profilePicture
        const publicId = email + 'profilePicture'
        const result = cloudinary.uploader.upload(profilePicture, {public_id: publicId})
        result.then((data) => {
            console.log(data);
            console.log(data.secure_url);
        }).catch((err) => {
            console.log(err);
        });
        const imageUrl = cloudinary.url(publicId, {
            // width: 100,
            // height: 150,
            // Crop: 'fill'
        });


        const newUser = new User({
            name: name,
            lastName: lastName,
            nickName: nickName,
            email: email,
            address: address,
            phoneNumber: phoneNumber,
            profilePicture: profilePicture,
            salt: salt,
            password: hashed,
            admin: admin,
            token: token,
            profilePicture: imageUrl
        })
        await newUser.save();
        res.json('user created');
    };
});

// login route

router.post("/login", async (req, res) => {

    if (req.body.email && req.body.password){
        const user = await User.findOne({email: req.body.email});
        if (user) {
            const password = SHA256(req.body.password + user.salt).toString();
            if (user.password === password) {
                res.json("successfully connected");
            } else {
                res.json("wrong password");
            }
        } else {
            res.json("Wrong user or password");
        }
    } else {
        res.json('email or password empty');
    }

});

//delete route

router.delete("/delete/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json("User deleted");
    });

//modification route

router.put("/modification/:id", async (req, res) => {
    const userInfos = await User.findById(req.params.id);

    if (userInfos){
        if (req.body.nickName) {
            userInfos.nickName = req.body.nickName;
        }
        if (req.body.email) {
            userInfos.email = req.body.email;
        }
        if (req.body.address) {
            userInfos.address = req.body.address;
        }
        if (req.body.phoneNumber) {
            userInfos.phoneNumber = req.body.phoneNumber;
        }
        if (req.body.profilePicture) {
            userInfos.profilePicture = req.body.profilePicture;
        }
        if (req.body.password) {
            const newPassword = SHA256(req.body.password + userInfos.salt).toString();
            userInfos.password = newPassword;
        }

        await userInfos.save();
        res.json("user modified");
    } else {
        res.json("There's no user");
    }
})


module.exports = router;
