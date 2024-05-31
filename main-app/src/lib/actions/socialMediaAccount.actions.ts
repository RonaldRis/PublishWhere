"use server";

import { Marca, Publication, SocialMediaAccount } from "@/lib/models/models";
import { IMarca } from "shared-lib/models/marca.model";
import { IServerResponse } from "./ServerResponse";



export async function deleteRedSocialAction(marcaId: string, redSocialId: string, userId: string): Promise<IServerResponse<boolean>> {
    try {

        const marcasQuery = await Marca.findOne({ _id: marcaId });

        const marca = JSON.parse(JSON.stringify(marcasQuery)) as IMarca;

        if (!marca) {
            return { data: false, isOk: false, message: "No hay marca" };
        }

        if (marca.admin != userId) {
            return { data: false, isOk: false, message: "No es posible eliminar la red social, solo el admin puede hacerlo" };
        }



        const resultDeleteSocialMediaFromMarca = await Marca.findOneAndUpdate(
            { _id: marcaId },
            { $pull: { socialMedia: redSocialId } },
            { new: true, useFindAndModify: false }
        );
        console.log("resultDeleteSocialMediaFromMarca", resultDeleteSocialMediaFromMarca);





        //ELIMINO LAS PUBLICACIONES DE LA RED SOCIAL 
        const resultDeleteSocialMediaFromPublicaciones = await Publication.updateMany(
            { _id: marcaId },
            { $pull: { 'socialMedia.socialMedia': redSocialId } }
        );

        console.log("resultDeleteSocialMediaFromPublicaciones", resultDeleteSocialMediaFromPublicaciones);

        ///Primero verifico que el usuario sea el admin de la marca a la que pertenece la marca

        const resultPublicationsDeletedFull = await Publication.deleteMany({ 'socialMedia': { $size: 0 } });
        console.log("resultPublicationsDeletedFull", resultPublicationsDeletedFull);


        if (resultDeleteSocialMediaFromMarca.upsertedCount == 0) {
            return { data: false, isOk: false, message: "No se encontró la red social a eliminar" };
        }



        return {
            data: true,
            isOk: true,
            message: "Red social eliminada con éxito"
        };

    } catch (error: any) {
        return { data: false, isOk: false, message: "No es posible eliminar la red social" };
    }
}