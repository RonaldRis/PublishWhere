import { Router } from "express";
import fetch from 'node-fetch';
import qs from 'qs';


const TIKTOK_API_KEY = process.env.TIKTOK_API_KEY;
// const TIKTOK_API_SECRET = process.env.TIKTOK_API_SECRET;
const TIKTOK_API_CALLBACK = process.env.TIKTOK_API_CALLBACK;
const CLIENT_URL = process.env.CLIENT_URL;
console.log("CLIENT_URL", CLIENT_URL);
console.log("TIKTOK_API_CALLBACK", TIKTOK_API_CALLBACK);



const routerTikTok = Router();


routerTikTok.get("/", (req, res) => {
    const csrfState = Math.random().toString(36).substring(2);
    res.cookie("csrfState", csrfState, { maxAge: 60000 });
    let url = "https://www.tiktok.com/v2/auth/authorize/";
    // the following params need to be in `application/x-www-form-urlencoded` format.
    url += "?client_key=" + "awo9tmh9u2lhxzsb"; //process.env.TIKTOK_API_KEY;
    url += "&scope=user.info.basic,user.info.profile,user.info.stats,video.list";
    url += "&response_type=code";
    url += "&redirect_uri=" + "https://auth.publishwhere.com/auth/tiktok/callback";
    url += "&state=" + csrfState;
    res.redirect(url);
});

routerTikTok.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies.csrfState;

    // if (state !== storedState) {
    //     return res.status(403).json({ error: 'Invalid state parameter' });
    // }

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



export {routerTikTok}