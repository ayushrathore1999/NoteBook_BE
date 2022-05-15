const express = require('express')
const res = require('express/lib/response')
const router = express.Router()

router.get('/', () => {
    res.send('auth called')
})

module.exports = router