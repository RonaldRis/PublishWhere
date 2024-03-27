const express = require("express");
const cors = require("cors");
const passportSetup = require("./lib/passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const app = express();

require('dotenv').config();

app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/auth", authRoute);

app.listen(process.env.PORT, () => {
  console.log("Server is running!");
});
