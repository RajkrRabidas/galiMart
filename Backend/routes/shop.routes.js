const express = require("express")

const router = express()


router.post("/upload", uploadToCloudinary)


module.exports = router