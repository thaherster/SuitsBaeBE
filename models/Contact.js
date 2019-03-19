const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ContactSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: false
  }
});

module.exports = Contact = mongoose.model("contacts", ContactSchema);
