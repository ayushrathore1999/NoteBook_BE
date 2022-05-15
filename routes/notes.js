const express = require('express')
const res = require('express/lib/response')
const router = express.Router()

router.get('/', () => {
    res.send('notes called')
})

module.exports = router