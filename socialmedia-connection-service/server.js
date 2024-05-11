require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport")

const app = express();
const routerYoutube = require("./routes/youtubeV3Oauth");
const routerTikTok = require('./routes/tiktokOauth');
const routerTwitter = require('./routes/twitterOauth');



app.use(cookieParser())
app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

app.use(
  session({ secret: 'keyboard cat', resave: false, saveUninitialized: true })
)
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "Ok", mainApp: "https://publishwhere.com", newAccount: {
      youtube: "https://auth.publishwhere.com/auth/youtube",
      tiktok: "https://auth.publishwhere.com/auth/tiktok",
      twitter: "https://auth.publishwhere.com/auth/twitter",
    }
  })
})

app.get("/auth", (req, res) => {
  res.json({
    youtube: "https://auth.publishwhere.com/auth/youtube",
    tiktok: "https://auth.publishwhere.com/auth/tiktok",
    twitter: "https://auth.publishwhere.com/auth/twitter",
  })
});


app.use("/auth", routerYoutube);
app.use("/auth", routerTikTok);
app.use("/auth",routerTwitter);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running! http://localhost:" + PORT);
});
