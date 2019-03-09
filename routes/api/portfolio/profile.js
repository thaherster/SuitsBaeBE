const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../../service/uploaddoc");
const singleUpload = upload.single("resume");

//load Profile model
const Profile = require("../../../models/Profile");
//load User model
const User = require("../../../models/User");

//@route GET api/portfolio/profile/test
//@desc Test users route
//@access Public
router.get("/test", (req, res) => res.json({ message: "profile Works" }));

//@route GET api/portfolio/profile/:id
//@desc GET profile from profile id
//@access Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findById(req.params.id)
      .then(profile => {
        res.json(profile);
      })
      .catch(err => res.status(404).json({ error: "No profile found" }));
  }
);

//@route POST api/portfolio/profile/
//@desc GET profile from emailid
//@access Public
router.post("/", (req, res) => {
  //Find user by email
  User.findOne({ email: req.body.email }).then(user => {
    //Check user
    if (!user) {
      errors.email = "User not found";
      return res.status(400).json(errors);
    }
    console.log(user);
    Profile.findOne({ user: user._id })
      .then(profile => {
        if (profile) res.json(profile);
        else res.json({});
      })
      .catch(err => res.status(404).json({ error: "No profile found" }));
  });
});

//@route POST api/portfolio/profile/upload
//@desc GET profile from emailid
//@access Private
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    singleUpload(req, res, function(err, some) {
      if (err) {
        return res.status(422).send({
          errors: [{ title: "Resume Upload Error", detail: err.message }]
        });
      }
      Profile.findOne({ user: req.user.id })
        .then(profile0 => {
          if (profile0) {
            //Update
            Profile.findOneAndUpdate(
              { user: req.user.id },
              { resume: req.file.location },
              { new: true }
            )
              .then(profile1 => res.json(profile1))
              .catch(err => {
                res.status(400).json(err);
              });
          } else {
            //Create
            const newPr = new Profile({
              user: req.user.id,
              resume: req.file.location
            });
            //Save profile
            newPr.save().then(profile2 => {
              res.status(200).json(profile2);
            });
          }
        })
        .catch(err => {
          res.status(400).json(err);
        });
      // return res.json({ imageUrl: req.file.location });
    });
  }
);

//@route DELETE api/portfolio/profile/:id
//@desc DELETE profile (only done by the owner)
//@access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ user: req.user.id })
      .then(user => {
        Profile.findById(req.params.id)
          .then(profile => {
            //Check for avatar owner
            if (profile.user.toString() !== req.user.id) {
              return res.status(401).json({ authorize: "User not autorize" });
            }

            //Delete
            profile.remove().then(() => {
              return res.status(200).json({ success: true });
            });
          })
          .catch(err => {
            return res.status(404).json({ profilenotfound: "No post found" });
          });
      })
      .catch(err => {
        return res.status(404).json({ usernotfound: "No user found" });
      });
  }
);

module.exports = router;
