const express = require("express");
const router = express.Router();
const passport = require("passport");
const YoutubeV3Strategy = require("passport-youtube-v3").Strategy;
const axios = require("axios");
const qs = require("qs");

require('dotenv').config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_SECRET = process.env.YOUTUBE_API_SECRET;
const YOUTUBE_API_CALLBACK = process.env.YOUTUBE_API_CALLBACK;
const CLIENT_URL = process.env.CLIENT_URL;
console.log("CLIENT_URL", CLIENT_URL);
console.log("YOUTUBE_API_CALLBACK", YOUTUBE_API_CALLBACK);

// Make sure the client ID/secret is setup for the following urls:
// Domain: http://localhost:8080
// Callback url: http://localhost:8080/callback

//SCOPES: https://developers.google.com/youtube/v3/guides/auth/installed-apps?hl=es-419
passport.use(
  new YoutubeV3Strategy(
    {
      clientID: YOUTUBE_API_KEY,
      clientSecret: YOUTUBE_API_SECRET,
      callbackURL: YOUTUBE_API_CALLBACK,
      scope: [
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/youtube.upload",
        // "https://www.googleapis.com/auth/youtube.force-ssl",
      ],
    },
    function (accessToken, refreshToken, profile, done) {
      console.info("FUNCTION CALLED FOR YOUTUBE STRATEGY");
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      console.log("PROFILE AFTER", profile);
      console.log("\n\n\n");

      // save the TOKEN Y REFRESH to the database
      // Guardar alguna cookie en el header para que llegue al cliente en el callbackURL

      done(profile);
    }
  )
);
console.log("\n\n\n");

const routerYoutube = router;

routerYoutube.get("/youtube", passport.authenticate("youtube"));
routerYoutube.get("/youtube/callback", async function (req, res) {
  console.log("req.query", req.query);
  const code = req.query.code;

  const data = {
    client_id: process.env.YOUTUBE_API_KEY,
    client_secret: process.env.YOUTUBE_API_SECRET,
    redirect_uri: process.env.YOUTUBE_API_CALLBACK,
    grant_type: "authorization_code",
    code: code, // replace with your authorization code
  };


  var tokensDATA = null;
  await axios
    .post("https://oauth2.googleapis.com/token", qs.stringify(data), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => {
      console.log("RESPONSE");
      console.log(response);
      console.log("\n\n\n");

      console.log(response.data);
      
      tokensDATA = response.data;
    })
    .catch((error) => {
      console.error(error);
    });

    tokensDATA.provider = "youtube";

    const page = "/perfil/marcas/callback-youtube?";
    res.redirect(CLIENT_URL+page+qs.stringify(tokensDATA));


});

module.exports = routerYoutube;
// Path: socialmedia-connection-service/routes/youtubeV3Oauth.js
