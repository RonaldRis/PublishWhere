import { routerTikTok } from "./tiktokOauth.js";
import { routerTwitter } from "./twitterOauth.js";
import { routerYoutube } from "./youtubeV3Oauth.js";

import {Router} from "express"

const routerAuth = Router();

routerAuth.get("/", (req, res) => {
  res.json({
    youtube: "https://auth.publishwhere.com/auth/youtube",
    tiktok: "https://auth.publishwhere.com/auth/tiktok",
    twitter: "https://auth.publishwhere.com/auth/twitter",
  })
});


routerAuth.use("/youtube", routerYoutube);
routerAuth.use("/tiktok", routerTikTok);
routerAuth.use("/twitter", routerTwitter);

export { routerAuth}