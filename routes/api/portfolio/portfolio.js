const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../../config/keys");
const passport = require("passport");

//load User model
const Avatar = require("../../../models/Avatar");
const Contact = require("../../../models/Contact");
const Profile = require("../../../models/Profile");
const Handle = require("../../../models/Handle");
const User = require("../../../models/User");

//@route GET api/portfolio/test
//@desc Test users route
//@access Public
router.get("/test", (req, res) => res.json({ message: "Portfolio Works" }));

//@route GET api/portfolio
//@desc GET complete portfolio
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const portfolio = {};
    const handle = Handle.findOne({ user: req.user.id }).then(handle => {
      if (handle) return handle;
      else return {};
    });
    const avatar = Avatar.findOne({ user: req.user.id }).then(avatar => {
      if (avatar) return avatar;
      else return {};
    });
    const contact = Contact.findOne({ user: req.user.id }).then(contact => {
      if (contact) return contact;
      else return {};
    });
    const profile = Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) return profile;
      else return {};
    });

    Promise.all([avatar, contact, profile, handle]).then(function(values) {
      console.log(values);
      portfolio.name = req.user.name;
      portfolio.id = req.user.id;
      portfolio.email = req.user.email;
      portfolio.avatar = values[0];
      portfolio.contact = values[1];
      portfolio.profile = values[2];
      portfolio.handle = values[3];
      res.json(portfolio);
    });
  }
);

//@route GET api/portfolio/public/:handle
//@desc GET complete portfolio
//@access Public
router.get("/public/:handle", (req, res) => {
  const portfolio = {};
  Handle.findOne({ handle: req.params.handle }).then(handle => {
    if (handle) {
      portfolio.handle = handle;
      const avatar = Avatar.findOne({ user: handle.user }).then(avatar => {
        if (avatar) return avatar;
        else return {};
      });
      const contact = Contact.findOne({ user: handle.user }).then(contact => {
        if (contact) return contact;
        else return {};
      });
      const profile = Profile.findOne({ user: handle.user }).then(profile => {
        if (profile) return profile;
        else return {};
      });

      const user = User.findById(handle.user).then(user => {
        if (user) return user;
        else return {};
      });

      Promise.all([avatar, contact, profile, user]).then(function(values) {
        console.log(values);
        portfolio.avatar = values[0];
        portfolio.contact = values[1];
        portfolio.profile = values[2];
        portfolio.name = values[3].name;
        portfolio.id = values[3].id;
        portfolio.email = values[3].email;
        res.json(portfolio);
      });
    } else return res.status(404).json({ error: "No profile found" });
  });
});

module.exports = router;
