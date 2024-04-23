"use server";

import { youtube } from "googleapis/build/src/apis/youtube";
import { IMarca } from "../models/marca.model";
import { Marca, Oauth, SocialMediaAccount, User } from "../models/models";
import { IOauth, IOauthPost } from "../models/Oauth.model";
import { IServerResponse } from "./ServerResponse";
import google, { youtube_v3 } from "googleapis";
import { custom } from "zod";
import { Console } from "console";
import {
  ISocialMediaAccount,
  ISocialMediaAccountPost,
} from "../models/socialMediaAccount.model";
import mongoose from "mongoose";

export async function postOauthDataAction({
  marcaId,
  userId,
  oauthData,
}: {
  marcaId: string;
  userId: string;
  oauthData: IOauthPost;
}): Promise<IServerResponse<IOauth>> {
  try {
    if (!oauthData) {
      return { data: null, isOk: false, message: "No hay provider" };
    }
    if (oauthData.provider == "null") {
      return {
        data: null,
        isOk: false,
        message: "No hay es posible obtener la red social, intenta de nuevo",
      };
    }

    //TODO: vamos a conseguir tokens de mayor duración primero:

    // //Ahora guardo el oauthData en la base de datos
    // const oauthDataQuery = await Oauth.create({
    //   ...oauthData,
    // });

    // const oauthDataResult = JSON.parse(
    //   JSON.stringify(oauthDataQuery)
    // ) as IOauth;
    // console.log("OauthDataResult: ", oauthDataResult);

    if (oauthData.provider == "youtube") {
      console.log("\n\n\nData: postOauthDataAction");

      const youtubeInstance = youtube({
        version: "v3",
      });

      try {
        const response = await youtubeInstance.channels.list({
          part: ["snippet", "contentDetails", "statistics"],
          mine: true,
          access_token: oauthData.access_token,
        });

        console.log("\n\nResponse.data.items: ");
        console.log(response.data.items);

        if (response.data.items && response.data.items.length == 0) {
          return {
            data: null,
            isOk: false,
            message: "No se encontró canal de youtube",
          };
        }

        ///Gaurdo el oauthData en la base de datos

        await response.data.items?.forEach(async (channel) => {
         

          //TODO: URGENTE THIS IS NOT WORKING -Almacenar cuenta de youtube en la base de datos
          const socialMediaAccountQuery = new SocialMediaAccount({
            _idOnProvider: channel.id,
            name: channel.snippet?.title,
            description: channel.snippet?.description,
            provider: "youtube",
            userCreator: userId,
            thumbnail: channel.snippet?.thumbnails?.default?.url,
            username: channel.snippet?.customUrl,
            urlPage: `https://www.youtube.com/channel/${channel.id}`,
            kind: "channel",
          });

          socialMediaAccountQuery.oauth.create(oauthData);


          await socialMediaAccountQuery.save();



          const socialMediaAccountResult = JSON.parse(
            JSON.stringify(socialMediaAccountQuery)
          ) as ISocialMediaAccount;


          console.log("SocialMediaAccountResult: ", socialMediaAccountResult);


          // al campo de socialMedia de la marca hacer un push del id de la cuenta de youtube
          const marcaQuery = await Marca.findByIdAndUpdate(marcaId, {
            $push: { socialMedia: socialMediaAccountResult._id },
          });

          ///INVERTIR DE TODO A NADA: -> OBTENER LA MARCA, AGREGAR 



          ///LUEGO TENER CUIDADO DE NO AGREGAR UN CANAL QUE YA ESTÁ EN LA BASE DE DATOS DE LA MISMA MARCA

          console.log("This is the channel: ", channel);
        });

        return {
          data: null,
          isOk: true,
          message: "Canal de youtube agregado correctamente",
        };
      } catch (error) {
        console.error("Error fetching channel data:", error);
        throw error;
      }

      //Llamar al servicio de youtube para conseguir el token de mayor duración
      //https://developers.google.com/identity/protocols/oauth2/web-server#offline
    }


    return { data: null, isOk: true, message: "FUNCIONAAA CARAJO" };
  } catch (error: any) {
    console.log("Error: ", error);
    return { data: null, isOk: false, message: "Ya existe esa marca" };
  }
}
