import  express , {Router, Response, Request } from 'express';
import { routerTwitterPublish } from './twitterPublish';
import { routerYoutubePublish } from './youtubePublish';
import { createResponse, Publication } from 'shared-lib';
import axios from 'axios';

const routerPublish = Router();
routerPublish.use("/twitter", routerTwitterPublish);
routerPublish.use("/youtube", routerYoutubePublish);


const SELF_URL = process.env.SELF_URL; // .env ? 3001 :  URLServidor


routerPublish.get("/:idPublicacion", async (req:Request, res:Response) => {

    const { idPublicacion } = req.params;
    console.log("idPublicacion", idPublicacion);


    const result = await Publication.findById(idPublicacion);
    res.json(createResponse(true, "Publicacón encontrada", result));
    console.log("result", result);

    if (!result) {
        res.json(createResponse(false, "Publicacón no encontrada", null));
    }


    const promises = result.socialMedia.map((socialMedia: any) => {

        switch (socialMedia.provider) {
            case "twitter":
                return axios.post(SELF_URL + "/publish/twitter", {
                    idPublicacion: idPublicacion,
                    idRedSocial: socialMedia.socialMedia
                });

                break;
            case "youtube":
                return axios.post(SELF_URL + "/publish/youtube", {
                    idPublicacion: idPublicacion,
                    idRedSocial: socialMedia.socialMedia
                });

                break;
        }

    });

    Promise.all(promises).then((values) => {
        console.log("Promises", values);
        res.status(200).json(createResponse(true, "Publicación realizada", null));
    }).catch((error) => {
        console.log("Error", error);
        res.status(500).json(createResponse(false, "Error al publicar", null));
    });


    res.json(createResponse(false, "Publicacón no encontrada", null));

});





export { routerPublish }



