const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token)
        return res.status(400).send({ err: "Please provide auth token" })

    try {
        const data = jwt.verify(token, 'buldozer')
        req.body.user = data.user
        next()
    } catch (err) {
        res.status(400).send({ err: "Please provide a valid auth token" })
    }
}

module.exports = fetchUser;