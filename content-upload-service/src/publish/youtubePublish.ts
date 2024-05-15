import { google } from 'googleapis';
import fs from 'fs';

import { Router, Request, Response } from "express";
import { createResponse, Publication, SocialMediaAccount } from "shared-lib";
import { deleteMultimediaFileFromS3, downloadMultimediaFileFromS3, updateSocialMediaPost } from "./utils";
import { IPublication } from "shared-lib/models/publicaction.model";
import { IOauth } from "shared-lib/models/Oauth.model";
import { youtube } from "@googleapis/youtube";



const routerYoutubePublish = Router();
// const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
// const YOUTUBE_API_SECRET = process.env.YOUTUBE_API_SECRET;
// const YOUTUBE_API_CALLBACK = process.env.YOUTUBE_API_CALLBACK;





routerYoutubePublish.post("/", async (req: Request, res: Response) => {

  console.log("UPLOAD BACKEND youtube: ", req.url);



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




  ///Subo EL VIDEO 

  if (publicationSelected.files.length < 1 || publicationSelected.files[0].type !== "video") {
    return res.json(createResponse(false, 'No se ha encontrado un video en la publicación', null));
  }

  const filename = await downloadMultimediaFileFromS3(publicationSelected.files[0]);
  if (!filename) {
    return res.json(createResponse(false, 'Error al descargar el archivo', null));
  }


  // Crear una instancia del cliente OAuth2 y configurar las credenciales con el token de acceso
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: oauthSelected.access_token,
  });

  const youtubeInstance = youtube({
    version: "v3",
    auth: oauth2Client
  });

  var idVideo = undefined;

  const fileSize = fs.statSync(filename).size;
  try {
    const resYoutube = await youtubeInstance.videos.insert({
      part: ['snippet,status'],
      requestBody: {
        snippet: {
          title: publicationSelected.title,
          description: 'Descripción del video',
          tags: ['tag1', 'tag2'],
          categoryId: '22' // Por ejemplo, 22 es la categoría de 'People & Blogs'
        },
        status: {
          privacyStatus: 'private' // 'public', 'unlisted', 'private'
        }
      },
      media: {
        body: fs.createReadStream(filename)
      }
    },
      {
        // Use the `onUploadProgress` event from Axios to track the
        // number of bytes uploaded to this point.
        onUploadProgress: evt => {
          const progress = (evt.bytesRead / fileSize) * 100;
          console.log(`${Math.round(progress)}% complete`);
        },
      }
    );

    idVideo = resYoutube.data.id;
    console.log('\n\n');

    console.log('Video:', resYoutube);
    console.log('\n\n');
    console.log('\n\n');
    console.log('Video subido:', resYoutube.data);
    console.log('\n\n');


  } catch (error) {
    console.error('Error al subir el video:', error);
  }



  await deleteMultimediaFileFromS3(filename);




  ///Finalmente procedo a actualizar el objeto de la publicación

  if (!idVideo) {
    return res.json(createResponse(false, 'Error al subir el video', null));
  }
  const URL = "https://www.youtube.com/watch?v=" + idVideo;
  console.log("URL", URL);

  await updateSocialMediaPost(idPublicacion, idRedSocial, idVideo as string, URL);


  return res.json(createResponse(true, "Video subido a YouTube", null));
});



export { routerYoutubePublish }
