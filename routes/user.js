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
            await userInfos.save();
            res.json("user modified");
        } else {
            res.json("There's no user");
        }
    })

    // const modification = (infos) => {
        // router.put("/modification/:id", async (req, res) => {
        //     infos.nickName = req.body.nickName;
        //     infos.email = req.body.email;
        //     infos.address = req.body.address;
        //     infos.phoneNumber = req.body.phoneNumber;
        //     infos.profilePicture = req.body.profilePicture;
        //     await infos.save();
        //     res.json(infos);
        // })
    // }

module.exports = router;