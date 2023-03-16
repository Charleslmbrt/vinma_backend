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
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//registration route

router.post("/registration", auth, async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    const {name, lastName, nickName, email, address, phoneNumber, profilePicture, password, admin} = req.body;

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
            profilePicture: imageUrl
        })
        await newUser.save();
        res.json('user created');
    };
});

// login route

router.put("/login", async (req, res) => {

    if (req.body.email && req.body.password){
        const user = await User.findOne({email: req.body.email});
        if (user) {
            const password = SHA256(req.body.password + user.salt).toString();
            if (user.password === password) {

                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                });
             
                // const newToken = {token: jwt.sign(
                //     {userId: user._id},
                //     'RANDOM_TOKEN_SECRET',
                //     {expiresIn: "24h"}
                // )};
                // user.token = newToken;
                // user.save();

                // if (user.token) {
                //     res.json(user.token);
                // } else {
                //     res.json("token failed");
                // }

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

router.delete("/delete-user/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json("User deleted");
    });

//modification route

router.put("/modification/:id", auth, async (req, res) => {
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
