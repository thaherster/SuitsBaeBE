const express = require("express");
const router = express.Router();
const passport = require("passport");

//load Handle model
const Handle = require("../../../models/Handle");
//load User model
const User = require("../../../models/User");

const validateHandleInput = require("../../../validation/handle");

//@route GET api/portfolio/handle/test
//@desc Test users route
//@access Public
router.get("/test", (req, res) => res.json({ message: "Handle Works" }));

//@route GET api/portfolio/handle/:id
//@desc GET handle from handle id
//@access Private
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Handle.findById(req.params.id)
      .then(handle => {
        res.json(handle);
      })
      .catch(err => res.status(404).json({ error: "No handle found" }));
  }
);

//@route POST api/portfolio/handle
//@desc PoST handle
//@access Private
router.post("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res
) {
  Handle.findOne({ user: req.user.id })
    .then(handle0 => {
      const { errors, isValid } = validateHandleInput(req.body);

      //Check Validation
      if (!isValid) {
        //Return any erros with 400 status
        return res.status(400).json(errors);
      }

      if (handle0) {
        //Update
        Handle.findOneAndUpdate(
          { user: req.user.id },
          { handle: req.body.handle },
          { new: true }
        )
          .then(handle4 => res.json(handle4))
          .catch(err => {
            res.status(400).json(err);
          });
      } else {
        //Create

        //Check if handle exists to make it seo friendly
        Handle.findOne({ handle: req.body.handle }).then(handle1 => {
          if (handle1) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          //Create
          const newHandle = new Handle({
            user: req.user.id,
            handle: req.body.handle
          });
          //Save profile
          newHandle.save().then(handle2 => {
            res.status(200).json(handle2);
          });
          //Save profile
        });
      }
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
