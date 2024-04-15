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

    //Ahora guardo el oauthData en la base de datos
    const oauthDataQuery = await Oauth.create({
      provider: oauthData.provider,
      access_token: oauthData.access_token,
      expires_in: oauthData.expires_in,
      refresh_token: oauthData.refresh_token,
      scope: oauthData.scope,
      token_type: oauthData.token_type,
    });

    const oauthDataResult = JSON.parse(
      JSON.stringify(oauthDataQuery)
    ) as IOauth;
    console.log("OauthDataResult: ", oauthDataResult);

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

        console.log("\n\nResponse: ");
        console.log(response);
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

        response.data.items?.forEach(async (channel) => {
          const channelData: ISocialMediaAccountPost = {
            name: channel.snippet?.title!,
            username: channel.snippet?.title!,
            description: channel.snippet?.description!,
            thumbnail: channel.snippet?.thumbnails?.default?.url!, //TODO: REVISAR SI ESTÁ DIMENSION ESTÁ BIEN
            kind: channel.kind!,
            _idOnProvider: channel.id!,
            urlPage: channel.snippet?.customUrl!,
            provider: "youtube",
            userCreator: userId,
            oauth: oauthDataResult._id,
          };

          //TODO: URGENTE THIS IS NOT WORKING -Almacenar cuenta de youtube en la base de datos
          const socialMediaAccountQuery = await SocialMediaAccount.create(
            channelData
          );
          const socialMediaAccountResult = JSON.parse(
            JSON.stringify(socialMediaAccountQuery)
          ) as ISocialMediaAccount;

          console.log("Channel Data: ", channelData);

          console.log("SocialMediaAccountResult: ", socialMediaAccountResult);

          ///LUEGO TENER CUIDADO DE NO AGREGAR UN CANAL QUE YA ESTÁ EN LA BASE DE DATOS DE LA MISMA MARCA

          console.log("This is the channel: ", channel);
        });

        return {
          data: oauthDataResult,
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

    // var fechaExp = new Date();
    // fechaExp.setSeconds(fechaExp.getSeconds() + data.oauthData.expires_in - 5); ///5 Segundo relativo al timepo que tarda esto en ejecutarse

    // const resultQuery = await OauthData.create({
    //   provider: data.provider,
    //   access_token: data.oauthData.access_token,
    //   expireDate: fechaExp,
    //   refresh_token: data.oauthData.refresh_token,
    //   scope: data.oauthData.scope,
    //   token_type: data.oauthData.token_type,
    // });

    // const result = JSON.parse(JSON.stringify(resultQuery)) as IOauthData;

    // //Primero llame al URL del OAUTH segun el provider y obtengo los datos

    // ///También tengo que general el token de larga duración si es que lo tiene

    // //Ahora esto tengo que guardarlo en la marca

    return { data: null, isOk: true, message: "FUNCIONAAA CARAJO" };
  } catch (error: any) {
    console.log("Error: ", error);
    return { data: null, isOk: false, message: "Ya existe esa marca" };
  }
}
