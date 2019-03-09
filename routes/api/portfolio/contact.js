const express = require("express");
const router = express.Router();
const passport = require("passport");

//load User model
const Contact = require("../../../models/Contact");

//@route GET api/portfolio/contact/test
//@desc Test users route
//@access Public
router.get("/test", (req, res) => res.json({ message: "Contact Works" }));

module.exports = router;
