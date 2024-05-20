import { Console } from 'console';

import { Router, Response, Request } from "express";
import fs from "fs";
import axios from "axios";
import qs from "qs";
import { TweetV2PostTweetResult, TwitterApi } from "twitter-api-v2";
import { createResponse, Oauth, Publication, SocialMediaAccount } from "shared-lib";
import { IPublication } from 'shared-lib/models/publicaction.model';
import { IOauth } from 'shared-lib/models/Oauth.model';
import { IFile } from 'shared-lib/models/file.model';
import { deleteMultimediaFileFromS3, downloadMultimediaFileFromS3, updateSocialMediaPost } from './utils';



const routerTwitterPublish = Router();

interface Tweet {
  data?: {
    id?: string;
  };
}



routerTwitterPublish.post("/", async function (req: Request, res: Response) {

  console.log("\n\n\n UPLOAD BACKEND twitter: ", req.url);

  const { idPublicacion, idRedSocial } = req.body;

  console.log("idPublicacion", idPublicacion);
  console.log("idRedSocial", idRedSocial);

  const result = await Publication.findById(idPublicacion).populate('socialMedia.socialMedia').populate('files');
  const publicationSelected = JSON.parse(JSON.stringify(result)) as IPublication;


  if (!result) {
    return res.json(createResponse(false, 'Publicación no encontrada', null));
  }


  //Necesito los OUATH
  const oauthquery = await SocialMediaAccount.findById(idRedSocial).populate('oauthID');
  const oauthSelected = JSON.parse(JSON.stringify(oauthquery.oauthID)) as IOauth;





  // // OAuth 1.0a (User context)
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: oauthSelected.access_token,
    accessSecret: oauthSelected.refresh_token,
  });

  ///Verifico si hay archivos por subir
  var filesId: string[] = [];

  for (let i = 0; i < publicationSelected.files.length; i++) {

    console.log("file : " + i, " ", publicationSelected.files[i]);

    const filename = await downloadMultimediaFileFromS3(publicationSelected.files[i]);
    if (filename) {
      const mediaId = await client.v1.uploadMedia(filename);
      console.log("MediaId ON Twitter after uploading image", mediaId);
      if (mediaId)
        filesId.push(mediaId as string);

      await deleteMultimediaFileFromS3(filename);
    }
  }


  var tweet: Tweet = {};

  if (filesId.length > 0) {
    tweet = await client.v2.tweet
      ({
        text: publicationSelected.title, media: { media_ids: filesId }
      });
  }
  else {
    tweet = await client.v2.tweet
      ({
        text: publicationSelected.title
      });
  }

  console.log("Tweet creado ", tweet);

  const me = await client.v2.me();


  ///Finalmente procedo a actualizar el objeto de la publicación

  const URL = "https://twitter.com/" + me.data.username + "/status/" + tweet?.data?.id;

  console.log("URL", URL);

  await updateSocialMediaPost(idPublicacion, idRedSocial, tweet?.data?.id as string, URL);


  return res.json(createResponse(true, "Tweet publicado", null));
});



export { routerTwitterPublish }