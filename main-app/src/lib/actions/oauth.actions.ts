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
import mongoose, { Document } from "mongoose";

async function agregarSocialMediaAccoutToMarca(social: Document, marcaId: string) {
  const marcaQuery = await Marca.findById(marcaId).populate('socialMedia');



  if (marcaQuery) {
    const channelExists = marcaQuery.socialMedia.some((account: any) =>
      account._idOnProvider === (social as any)._idOnProvider
      && account.provider === (social as any).provider);

    // Si el canal no existe, lo agregamos
    if (!channelExists) {
      marcaQuery.socialMedia.push(social._id);
      await marcaQuery.save();
      console.log("Canal agregado a la marca");
    } else {
      console.log("El canal ya existe en la marca");
    }
  }


}


export async function postOauthDataActionYoutube({
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


        if (response.data.items && response.data.items.length == 0) {
          return {
            data: null,
            isOk: false,
            message: "No se encontró canal de youtube",
          };
        }

        ///Gaurdo el oauthData en la base de datos

        var oauthID = new Oauth(oauthData);
        await oauthID.save();




        await response.data.items?.forEach(async (channel) => {
          //Creo un canal de youtube

          const existSocialMedia = await SocialMediaAccount.findOne({
            _idOnProvider: channel.id,
            provider: "youtube",
          });

          //Verifico que existe
          if (existSocialMedia) {

            const oldOauth = existSocialMedia.oauthID;
            //Elimino el old oauth
            await Oauth.deleteMany({ _id: oldOauth._id });

            existSocialMedia.oauthID = oauthID;

            existSocialMedia.name = channel.snippet?.title;
            existSocialMedia.description = channel.snippet?.description;
            existSocialMedia.thumbnail = channel.snippet?.thumbnails?.default?.url;
            existSocialMedia.username = channel.snippet?.customUrl;
            existSocialMedia.urlPage = `https://www.youtube.com/channel/${channel.id}`;
            existSocialMedia.kind = "channel";
            await existSocialMedia.save();

            await agregarSocialMediaAccoutToMarca(existSocialMedia, marcaId);


            return 1;
          }



          //No existe el canal en la base de datos, lo creo y guardo sus datos del token
          const socialMediaAccountQueryNew = new SocialMediaAccount({
            _idOnProvider: channel.id,
            name: channel.snippet?.title,
            description: channel.snippet?.description,
            provider: "youtube",
            userCreator: userId,
            thumbnail: channel.snippet?.thumbnails?.default?.url,
            username: channel.snippet?.customUrl,
            urlPage: `https://www.youtube.com/channel/${channel.id}`,
            kind: "channel",
            oauthID: oauthID,
            marcaId: marcaId,
          });

          await socialMediaAccountQueryNew.save();
          console.log("Canal de youtube guardado en la base de datos");

          //Agrego el canal de youtube a la marca
          await agregarSocialMediaAccoutToMarca(socialMediaAccountQueryNew, marcaId);


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




export async function postOauthDataActionTwitter({
  marcaId,
  userId,
  socialMediaData,
  oauthData,
}: {
  marcaId: string;
  userId: string;
  socialMediaData: ISocialMediaAccountPost;
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

    if(!marcaId){
      return { data: null, isOk: false, message: "Selecciona una marca primero" };
    }


    var message = "Canal de twitter agregado correctamente";


    var oauthID = new Oauth(oauthData);
    await oauthID.save();


    //Verifico si existe el canal de twitter en la base de datos
    var socialMediaDbItem = await SocialMediaAccount.findOne({
      _idOnProvider: socialMediaData._idOnProvider,
      provider: socialMediaData.provider,
    });

    //Valido si existe el canal de twitter
    if (socialMediaDbItem) {
      //Actualizo el oauthID
      await Oauth.deleteMany({ _id: socialMediaDbItem.oauthID._id });
      socialMediaDbItem.oauthID = oauthID;
      socialMediaDbItem.save();

      await agregarSocialMediaAccoutToMarca(socialMediaDbItem, marcaId);

      return {
        data: null,
        isOk: true,
        message: "Canal de twitter actualizado correctamente",
      };
    }
    else 
    {
      //No existe el canal en la base de datos, lo creo y guardo sus datos del token
      socialMediaDbItem = new SocialMediaAccount({
        _idOnProvider: socialMediaData._idOnProvider,
        name: socialMediaData.name,
        description: socialMediaData.description,
        provider: socialMediaData.provider,
        userCreator: userId,
        thumbnail: socialMediaData.thumbnail,
        username: socialMediaData.username,
        urlPage: socialMediaData.urlPage,
        kind: socialMediaData.kind,
        oauthID: oauthID,
        marcaId: marcaId,
      });

      await socialMediaDbItem.save();
      console.log("Canal de twitter guardado en la base de datos");

      //Agrego el canal de twitter a la marca
      await agregarSocialMediaAccoutToMarca(socialMediaDbItem, marcaId);

      return {
        data: null,
        isOk: true,
        message: "Canal de twitter agregado correctamente",
      };
    }

    
   
  } catch (error) {
    console.error("Error fetching channel data:", error);
    return  { data: null, isOk: false, message: "Error al agregar canal de twitter" };
  }

}
