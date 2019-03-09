const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../../service/upload");
const singleUpload = upload.single("image");

//load Avatar model
const Avatar = require("../../../models/Avatar");
//load User model
const User = require("../../../models/User");

//@route GET api/portfolio/avatar/test
//@desc Test users route
//@access Public
router.get("/test", (req, res) => res.json({ message: "Avatar Works" }));

//@route GET api/portfolio/avatar/:id
//@desc GET avatar from avatar id
//@access Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Avatar.findById(req.params.id)
      .then(avatar => {
        res.json(avatar);
      })
      .catch(err => res.status(404).json({ error: "No avatar found" }));
  }
);

//@route POST api/portfolio/avatar/
//@desc GET avatar from emailid
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
    Avatar.findOne({ user: user._id })
      .then(avatar => {
        if (avatar) res.json(avatar);
        else res.json({});
      })
      .catch(err => res.status(404).json({ error: "No avatar found" }));
  });
});

//@route POST api/portfolio/avatar/upload
//@desc Upload or Update avatar image
//@access Private
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    singleUpload(req, res, function(err, some) {
      if (err) {
        return res.status(422).send({
          errors: [{ title: "Image Upload Error", detail: err.message }]
        });
      }
      Avatar.findOne({ user: req.user.id })
        .then(avatar0 => {
          if (avatar0) {
            //Update
            Avatar.findOneAndUpdate(
              { user: req.user.id },
              { avatar: req.file.location },
              { new: true }
            )
              .then(avatar1 => res.json(avatar1))
              .catch(err => {
                res.status(400).json(err);
              });
          } else {
            //Create
            const newAv = new Avatar({
              user: req.user.id,
              avatar: req.file.location
            });
            //Save avatar
            newAv.save().then(avatar2 => {
              res.status(200).json(avatar2);
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

//@route DELETE api/portfolio/avatar/:id
//@desc DELETE avatar (only done by the owner)
//@access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ user: req.user.id })
      .then(user => {
        Avatar.findById(req.params.id)
          .then(avatar => {
            //Check for avatar owner
            if (avatar.user.toString() !== req.user.id) {
              return res.status(401).json({ authorize: "User not autorize" });
            }

            //Delete
            avatar.remove().then(() => {
              return res.status(200).json({ success: true });
            });
          })
          .catch(err => {
            return res.status(404).json({ avatarnotfound: "No post found" });
          });
      })
      .catch(err => {
        return res.status(404).json({ usernotfound: "No user found" });
      });
  }
);

module.exports = router;
