const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");
const qs = require("qs");

require("dotenv").config();

const TIKTOK_API_KEY = process.env.TIKTOK_API_KEY;
const TIKTOK_API_SECRET = process.env.TIKTOK_API_SECRET;
const TIKTOK_API_CALLBACK = process.env.TIKTOK_API_CALLBACK;
const CLIENT_URL = process.env.CLIENT_URL;
console.log("CLIENT_URL", CLIENT_URL);
console.log("TIKTOK_API_CALLBACK", TIKTOK_API_CALLBACK);


const routerTikTok = router;

// Redirect user to TikTok's OAuth page
routerTikTok.get("/tiktok", (req, res) => {
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie("csrfState", csrfState, { maxAge: 60000 });

  const scope = "user.info.basic";
  const redirect_uri = "http://localhost:3000/auth/tiktok/callback";
  const client_id = "YOUR_CLIENT_ID";
  const state = "your_random_string"; // This should be a unique string for each request
  const url = `https://open.tiktok.com/platform/oauth/connect/?client_key=${client_id}&scope=${scope}&response_type=code&redirect_uri=${redirect_uri}&state=${state}`;
  res.redirect(url);
});

// Handle callback from TikTok
routerTikTok.get("/tiktok/callback", async (req, res) => {

  console.log("req.query", req.query)
  console.log("req", req)
  console.log("res", res)


  const code = req.query.code;
  const state = req.query.state;
  const client_id = process.env.TIKTOK_API_KEY;
  const client_secret = process.env.TIKTOK_API_SECRET;
  const redirect_uri = process.env.TIKTOK_API_CALLBACK;

  try {
    const response = await axios.post(
      "https://open.tiktok.com/oauth/access_token/",
      {
        client_key: client_id,
        client_secret: client_secret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirect_uri,
      }
    );

    const accessToken = response.data.data.access_token;
    res.send("Access Token: " + accessToken);
  } catch (error) {
    res.send("An error occurred: " + error.message);
  }
});

routerTikTok.get("/tiktok/callbackCopyYoutube", async function (req, res) {
  console.log("req.query", req.query);
  const code = req.query.code;

  const data = {
    client_id: process.env.TIKTOK_API_KEY,
    client_secret: process.env.TIKTOK_API_SECRET,
    redirect_uri: process.env.TIKTOK_API_CALLBACK,
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

  tokensDATA.provider = "tiktok";

  const page = "/perfil/marcas/callback-red-social?";
  res.redirect(CLIENT_URL + page + qs.stringify(tokensDATA));
});

module.exports = routerTikTok;
// Path: socialmedia-connection-service/routes/tiktokV3Oauth.js
