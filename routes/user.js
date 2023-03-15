const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { SHA256 } = require("crypto-js");
const uid2 = require("uid2");


//registration route

router.post("/registration", async (req, res) => {
    const user = await User.findOne({email: req.body.email});

    const {name, lastName, nickName, email, address, phoneNumber, profilePicture, password, admin, token} = req.body;

    if(user) {
        res.json("Already exists");
    } else {

        const salt = uid2(120)
        const hashed = SHA256(password + salt);

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
                res.json("wrong combination");
            }
        } else {
            res.json("Wrong user or password");
        }
    } else {
        res.json('email or password empty');
    }

});

module.exports = router;