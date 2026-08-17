const express = require("express");
const { reverseGeocodeLocation } = require("../controllers/location.controller");

const router = express.Router();

router.get("/reverse-geocode", reverseGeocodeLocation);

module.exports = router;
