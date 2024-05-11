const express = require("express");
const router = express.Router();
const passport = require("passport");
const axios = require("axios");
const qs = require("qs");

require("dotenv").config();

const TIKTOK_API_KEY = process.env.TIKTOK_API_KEY;
// const TIKTOK_API_SECRET = process.env.TIKTOK_API_SECRET;
const TIKTOK_API_CALLBACK = process.env.TIKTOK_API_CALLBACK;
const CLIENT_URL = process.env.CLIENT_URL;
console.log("CLIENT_URL", CLIENT_URL);
console.log("TIKTOK_API_CALLBACK", TIKTOK_API_CALLBACK);



const routerTikTok = router;

routerTikTok.get('/tiktok', (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie('csrfState', csrfState, { maxAge: 60000 });

    const params = new URLSearchParams({
        client_key: TIKTOK_API_KEY,
        response_type: 'code',
        scope: 'user.info.basic,video.publish,video.upload',
        redirect_uri: TIKTOK_API_CALLBACK,
        state: csrfState
    });

    const url = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
    res.redirect(url);
});

routerTikTok.get('/tiktok/callback', async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies.csrfState;

    if (state !== storedState) {
        return res.status(403).json({ error: 'Invalid state parameter' });
    }

    try {
        const response = await fetch('https://www.tiktok.com/v2/auth/access_token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_key: TIKTOK_API_KEY,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: TIKTOK_API_CALLBACK
            })
        });
        const data = await response.json();
        res.json({ accessToken: data.data.access_token });
    } catch (error) {
        res.status(500).json({ error: 'Failed to obtain access token' });
    }
});



module.exports = routerTikTok;
// Path: socialmedia-connection-service/routes/tiktokV3Oauth.js
