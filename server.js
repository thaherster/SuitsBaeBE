const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const portfolio = require("./routes/api/portfolio/portfolio");
const avatar = require("./routes/api/portfolio/avatar");
const profile = require("./routes/api/portfolio/profile");
const contact = require("./routes/api/portfolio/contact");
const handle = require("./routes/api/portfolio/handle");

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDb Connected!"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());
//Passport Config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/portfolio", portfolio);
app.use("/api/portfolio/avatar", avatar);
app.use("/api/portfolio/contact", contact);
app.use("/api/portfolio/profile", profile);
app.use("/api/portfolio/handle", handle);

const port = process.env.PORT || 4000;

app.listen(port, () => console.log("Server running on port : " + port));
//npm run server to run in dev mode
