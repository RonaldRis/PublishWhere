
import { Router, Request, Response } from "express";
import { createResponse } from "shared-lib";



const routerYoutubePublish = Router();
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_SECRET = process.env.YOUTUBE_API_SECRET;
const YOUTUBE_API_CALLBACK = process.env.YOUTUBE_API_CALLBACK;
console.log("YOUTUBE_API_CALLBACK", YOUTUBE_API_CALLBACK);





routerYoutubePublish.post("/", (req:Request, res:Response)  => {

  console.log("UPLOAD BACKEND youtube: ",req.url);


  return res.json(createResponse(true, "FALTA POR HACERLO", null));
});



export {routerYoutubePublish}
