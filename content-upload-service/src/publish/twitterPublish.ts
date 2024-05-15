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
import { updateSocialMediaPost } from './utils';



const routerTwitterPublish = Router();

interface Tweet {
  data?: {
    id?: string;
  };
}

async function uploadMultimediaFileToTwitter(fileDb: IFile, client: TwitterApi): Promise<string | undefined> {
  try {
    const urlS3Image = "https://publishwhere-tfg.s3.eu-west-3.amazonaws.com/" + fileDb.bucketFileName;

    console.log("urlS3Image", urlS3Image);
    // Download the image
    const response = await axios({
      url: urlS3Image,
      method: 'GET',
      responseType: 'stream',
    });

    console.log("response", response);

    // Create a unique filename
    const filename = `./tmp/${Date.now()+fileDb.bucketFileName}`;
    console.log(filename);

    // Write the image to a file
    console.log("Write the image to a file");
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);

    // Wait for the file to finish writing
    console.log("Wait for the file to finish writing");
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log("file written");

    const mediaId = await client.v1.uploadMedia(filename);
    console.log(mediaId);


    // // Delete the file
    // fs.unlink(filename, (error) => {

    //   console.log("error", error);
    // });
    // console.log("file deleted");

    return mediaId;

  } catch (error) {
    console.error("Error uploading file to Twitter", error);
    return undefined;
  }

}



routerTwitterPublish.post("/", async function (req: Request, res: Response) {

  console.log("UPLOAD BACKEND twitter: ", req.url);

  console.log("BODY", req.body);
  const { idPublicacion, idRedSocial } = req.body;

  console.log("idPublicacion", idPublicacion);
  console.log("idRedSocial", idRedSocial);

  const result = await Publication.findById(idPublicacion).populate('socialMedia.socialMedia').populate('files');
  const publicationSelected = JSON.parse(JSON.stringify(result)) as IPublication;

  console.log("ALLLLL DATA NEEDED: ", publicationSelected);

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
  console.log("archivos:", filesId);

  for(let i = 0; i < publicationSelected.files.length; i++){

    console.log("file : " + i, " ", publicationSelected.files[i]);
    const mediaId = await uploadMultimediaFileToTwitter(publicationSelected.files[i], client);
    console.log("MediaId ON Twitter after uploading image", mediaId);
    if (mediaId)
      filesId.push(mediaId as string);
  }

  console.log("archivos Subidos:", filesId);

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

  console.log("TWEET HECHO", tweet);

  const me = await client.v2.me();


  ///Finalmente procedo a actualizar el objeto de la publicación

  const URL = "https://twitter.com/" + me.data.username + "/status/" + tweet?.data?.id;

  console.log("URL", URL);

  await updateSocialMediaPost(idPublicacion, idRedSocial, tweet?.data?.id as string, URL); 


  return res.json(createResponse(true, "TWEET PUBLICADO", null));
});



export { routerTwitterPublish }