const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

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

        let newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })

        return res.status(200).json(newUser)
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ err: "Something went wrong while creating a user" })
    }

})

module.exports = router