const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  resume: {
    type: String,
    required: true
  }
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
