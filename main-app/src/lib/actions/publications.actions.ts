"use server"

import { IPublication, IPublicationPost } from "shared-lib/models/publicaction.model";
import { IServerResponse } from "./ServerResponse";
import { Publication } from "@/lib/models/models";
import axios from "axios";



export async function postPublicationAction(oPublication: IPublicationPost): Promise<IServerResponse<IPublication>> {
    try {

        const result = await Publication.create(oPublication);

        if (!result) {
            return { data: null, isOk: false, message: "No es posible publicar en este momento" };
        }


        //TODO: HACER PRUEBAS USANDO EL SERVIDOR REAL PARA VERIFICAR LA HORA 
        if (oPublication.programmedDate) {
            console.log("programmedDate", oPublication.programmedDate);
            console.log("new Date()", new Date());
            if (oPublication.programmedDate <= new Date()) {
                console.log("Publicar en el momento");
                const URL = process.env.NEXTAUTH_URL+ "/api/post-content?id="+result._id;
                const resultGet = await axios.get(URL);
                }
            else {
                console.log("Fecha del futuro");
            }
        }

        return {
            data: JSON.parse(JSON.stringify(result)) as IPublication,
            isOk: true,
            message: "Publicación creada"
        };

    } catch (error: any) {
        console.log("error", error);
        return { data: null, isOk: false, message: "Error - No es posible publicar en este momento" };
    }
}