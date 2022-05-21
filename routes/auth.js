const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middlewares/auth');

const JWT_SECRET = 'buldozer';

router.post('/create', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password length should be atleast 5').isLength({ min: 5 }),
], async (req, res) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({ email: req.body.email })
        if (user)
            return res.status(400).json({ err: "User already exists." })

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        let newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        const data = {
            user: {
                id: newUser.id
            }
        }
        var authToken = jwt.sign(data, JWT_SECRET);

        return res.status(200).json({ authToken })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ err: "Something went wrong while creating a user" })
    }
})

router.get('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be empty').exists(),
], async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({ err: "user does not exist" })

        const correctPassword = await bcrypt.compare(password, user.password)
        if (!correctPassword)
            return res.status(400).json({ err: "invalid credentials" })

        const data = {
            user: {
                id: user.id
            }
        }
        var authToken = jwt.sign(data, JWT_SECRET);

        return res.status(200).json({ authToken })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ err: "Something went wrong while sign in" })
    }

})

router.get('/getUser', fetchUser,

    async (req, res) => {
        try {
            const userId = req.body.user.id
            const user = await User.findById(userId).select("-password")
            res.status(200).send(user)
        } catch (err) {
            console.log(err);
            return res.status(500).json({ err: "Something went wrong" })
        }
    })

module.exports = router