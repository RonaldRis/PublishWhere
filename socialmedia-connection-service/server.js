require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require("passport")
const cron = require('node-cron');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const qs = require('qs');


const app = express();
const routerYoutube = require("./routes/youtubeV3Oauth");
const routerTikTok = require('./routes/tiktokOauth');
const routerTwitter = require('./routes/twitterOauth');
const { default: mongoose } = require('mongoose');




app.use(cookieParser())
app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

app.use(
  session({ secret: 'minami no shima wa', resave: false, saveUninitialized: true })
)
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
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
app.use("/auth", routerTwitter);


//cron job  

const MONGODB_URL = process.env.MONGODB_URL;
const client = new MongoClient(MONGODB_URL);

async function refreshAccessToken(refresh_token) {

  const response = await fetch('https://oauth2.googleapis.com/token', {
    body: `client_id=${process.env.YOUTUBE_API_KEY}&client_secret=${process.env.YOUTUBE_API_SECRET}&refresh_token=${refresh_token}&grant_type=refresh_token`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
  })
  const data = await response.json()
  return data
}

// Connect to MongoDB outside of the scheduled task
client.connect().then(() => {
  console.log("Connected to MongoDB");

  // Schedule the task
  cron.schedule('*/20 * * * *', async () => {
    console.log('\nrunning a task every 20 minutes - UPDATE YOUTUBE ACCESS TOKENS\n');

    try {
      const db = client.db(); // Si tu URL no incluye el nombre de la base de datos, debes especificarlo aquí, como client.db('nombreDeTuBaseDeDatos')

      const Oauth = db.collection('oauths');
      const allOauth = await Oauth.find({ provider: "youtube" }).toArray();
      allOauth.forEach(async (oauthYoutubeChannel) => {
        console.log("HORA ACTUAL: ", new Date());

        const newAccessToken = await refreshAccessToken(oauthYoutubeChannel.refresh_token);
        if (newAccessToken) {
          var oneHourLater = new Date();
          oneHourLater.setHours(oneHourLater.getHours() + 1);
          console.log("oneHourLater", oneHourLater);
          await db.collection('oauths').updateOne({ _id: oauthYoutubeChannel._id }, { $set: { accessToken: newAccessToken.access_token, expires_in: oneHourLater } });
        }
      });
    } catch (err) {
      console.error(err);
    }
  });
}).catch(console.error);



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running! http://localhost:" + PORT);
});
