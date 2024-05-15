"use server"

import { IPublication, IPublicationPost } from "shared-lib/models/publicaction.model";
import { IServerResponse } from "./ServerResponse";
import { Publication } from "@/lib/models/models";



export async function postPublicationAction(oPublication: IPublicationPost): Promise<IServerResponse<IPublication>> {
    try {

        const result = await Publication.create(oPublication);

        ///VALIDAR SI HAY QUE PUBLICARLA EN EL MOMENTO O SOLO GUARDARLA (PROGRAMADA)


        return {
            data: JSON.parse(JSON.stringify(result)) as IPublication,
            isOk: true,
            message: "Publicación creada"
        };

    } catch (error: any) {
        console.log("error", error);
        return { data: null, isOk: false, message: "No es posible publicar en este momemento" };
    }
}