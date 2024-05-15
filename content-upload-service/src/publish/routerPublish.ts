import  express , {Router, Response, Request } from 'express';
import { routerTwitterPublish } from './twitterPublish';
import { routerYoutubePublish } from './youtubePublish';
import { createResponse, Publication } from 'shared-lib';
import axios from 'axios';

const routerPublish = Router();
routerPublish.use("/twitter", routerTwitterPublish);
routerPublish.use("/youtube", routerYoutubePublish);




export { routerPublish }



