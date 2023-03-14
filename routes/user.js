const express = require("express");
const router = express.Router();

const User = require("../models/User");

//registration route

router.post("/registration", async (req, res) => {
    const emailUser = await User.findOne({email: req.body.email});

    const {name, lastName, nickName, email, address, phoneNumber, profilePicture, password, salt, hash, admin, token} = req.body;

    if(emailUser) {
        res.json("Already exists");
    } else {
        const newUser = new User({
            name: name,
            lastName: lastName,
            nickName: nickName,
            email: email,
            address: address,
            phoneNumber: phoneNumber,
            profilePicture: profilePicture,
            password: password,
            // salt: salt,
            // hash: hash,
            admin: admin,
            token: token,
        })
        await newUser.save();
        res.json('user created');
    };
});

// login route

router.post("/login", async (req, res) => {
    const userEmail = await User.findOne({email: req.body.email});
    const userPassword = await User.findOne({password: req.body.password});

    if (userEmail && userPassword) {
        if (userEmail.params == userPassword.params) {
            res.json("successfully connected")
        } else {
            res.json("wrong combination")
        }
    } else {
        res.json("User or password doesnt exists")
    }
});

module.exports = router;