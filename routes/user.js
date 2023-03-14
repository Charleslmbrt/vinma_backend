const express = require("express");
const router = express.Router();

const User = require("../models/User");

//registration route

router.post("/registration", async (req, res) => {
    const emailUser = await User.findOne({email: req.body.email});

    const {name, lastName, nickName, email, address, phoneNumber, profilePicture, salt, hash, admin, token} = req.body;

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
            salt: salt,
            hash: hash,
            admin: admin,
            token: token,
        })
        await newUser.save();
        res.json('user created');
    };
});

module.exports = router;