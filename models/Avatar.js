const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const AvatarSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  avatar: {
    type: String,
    required: true
  }
});

module.exports = Avatar = mongoose.model("avatars", AvatarSchema);
