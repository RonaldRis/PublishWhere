
import { Router, Response, Request } from "express";
import fs from "fs";
import axios from "axios";
import qs from "qs";
import { TwitterApi } from "twitter-api-v2";
import { createResponse } from "shared-lib";



const routerTwitterPublish = Router();


const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_API_CALLBACK = process.env.TWITTER_API_CALLBACK;
const consumerKey = process.env.TWITTER_CONSUMER_KEY; //TWITTER_CONSUMER_KEY
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET; //TWITTER_CONSUMER_SECRET





routerTwitterPublish.post("/", async function (req: Request, res: Response) {

  return res.json(createResponse(true, "FALTA POR HACERLO", null));
});


export {routerTwitterPublish}