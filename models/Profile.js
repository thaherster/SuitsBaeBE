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

module.exports = User = mongoose.model("profiles", ProfileSchema);
