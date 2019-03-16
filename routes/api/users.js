const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const validateChangePassInput = require("../../validation/changepass");

//load User model
const User = require("../../models/User");

//@route GET api/users/test
//@desc Test users route
//@access Public
router.get("/test", (req, res) => res.json({ message: "Users Works" }));

//@route POST api/users/register
//@desc Register new user
//@access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exist";
      return res.status(400).json(errors);
    } else {
      //Create a new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              console.log(user);
              // Genrate a token and send back the token like login
              const payload = {
                name: user.name,
                id: user._id,
                isverified: user.isverified
              };
              // Create JWT payload
              //Sign Token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 86400 },
                (err, token) => {
                  res.json({ success: true, token: "Bearer " + token });
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@route POST api/users/login
//@desc Login  user / return JWT token
//@access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email: email }).then(user => {
    //Check user
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    }

    //Check password & hashed password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched
        const payload = {
          name: user.name,
          id: user.id,
          isverified: user.isverified
        }; // Create JWT payload
        //Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 1000000 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        errors.password = "Password Incorrect!";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route GET api/users/current
//@desc Return current user
//@access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      isverified: req.user.isverified
    });
  }
);

//@route POST api/users/changepass
//@desc Change password of the current user
//@access Private
router.post(
  "/changepass",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePassInput(req.body);
    const opassword = req.body.opassword;
    const npassword = req.body.npassword;

    const email = req.user.email;

    //Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //Find user by email
    User.findOne({ email: email }).then(user => {
      //Check user
      if (!user) {
        errors.email = "User not found";
        return res.status(400).json(errors);
      }

      //Check password & hashed password
      bcrypt.compare(opassword, user.password).then(isMatch => {
        if (isMatch) {
          //User Matched then Accept the passowrd change
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(npassword, salt, (err, hash) => {
              if (err) {
                throw err;
              }
              user.password = hash;
              console.log("------------");

              console.log(user);
              User.findByIdAndUpdate(user._id, { $set: user }, { new: true })
                .then(user => res.json(user))
                .catch(err => {
                  res.status(400).json(err);
                });
            });
          });
        } else {
          errors.opassword = "Password Incorrect!";
          return res.status(400).json(errors);
        }
      });
    });
  }
);

module.exports = router;
