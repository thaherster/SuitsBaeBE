const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const SubscribeSchema = new Schema({
  email: {
    type: String,
    required: true
  }
});

module.exports = Subscriber = mongoose.model("subscribers", SubscribeSchema);
