const express = require("express");
const { UserModel } = require("../model/user.model");
const { BlackListModel } = require("../model/blacklistUser.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    const { username, email, password, city, age, gender } = req.body;

    try {
        const isUserExists = await UserModel.findOne({ email });
        if (isUserExists) {
            res.status(401).json({ msg: "User already exists" });
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) res.json({ err: err });
                else {
                    const user = new UserModel({ username, email, password: hash, city, age, gender });
                    await user.save();
                    res.status(200).json({ msg: "new user has been registered!" });
                }
            })
        }
    } catch (err) {
        res.status(400).json({ err: err })
    }
})

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ userId: user._id }, "masai", { expiresIn: '7d' });
               // console.log(`userId = ${user._id} and ${token}`);
                res.json({ "msg": "Login Successfull!", token });
            } else {
                res.json({ "error": err });
            }
        })
    } catch (err) {
        res.json({ "err": err })
        console.log(err);
    }
});

userRouter.post('/logout', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization;
        await BlackListModel.create({ token });
        res.status(200).json({ "msg": "Logged out successfully" });
    } catch (err) {
        res.status(400).json({ "msg": err });
    }
});

// userRouter.get('/profile', authMiddleware, (req, res) => {
//     try{
//         res.status(200).send("User Profile")
//     } catch(err){
//         res.status(500).send("Internal error occured");
//     }
// })

module.exports = {
    userRouter
}
