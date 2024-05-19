"use server"

import { IPublication, IPublicationPost } from "shared-lib/models/publicaction.model";
import { IServerResponse } from "./ServerResponse";
import { File, Publication } from "@/lib/models/models";
import axios from "axios";



export async function postPublicationAction(oPublication: IPublicationPost): Promise<IServerResponse<IPublication>> {
    try {

        const result = await Publication.create(oPublication);



        if (!result) {
            return { data: null, isOk: false, message: "No es posible publicar en este momento" };
        }

        await Promise.all(oPublication.files.map((fileId) => {
            return File.findByIdAndUpdate(fileId, {alreadyUsed: true}).exec();
        }));


        //TODO: HACER PRUEBAS USANDO EL SERVIDOR REAL PARA VERIFICAR LA HORA 
        if (!oPublication.isSchedule) {
            console.log("programmedDate", oPublication.programmedDate);
            console.log("new Date()", new Date());
            if (oPublication.programmedDate <= new Date()) {
                console.log("Publicar en el momento");
                const URL = process.env.NEXTAUTH_URL + "/api/post-content?id=" + result._id;
                const resultGet = await axios.get(URL);

                return {
                    data: JSON.parse(JSON.stringify(result)) as IPublication,
                    isOk: true,
                    message: resultGet.data.message
                };
            }
        }
        console.log("Fecha del futuro");

        return {
            data: JSON.parse(JSON.stringify(result)) as IPublication,
            isOk: true,
            message: "Publicación programada correctamente"
        };

    } catch (error: any) {
        console.log("error", error);
        return { data: null, isOk: false, message: "Error - No es posible publicar en este momento" };
    }
}

export async function getPublicationByMarcaAction(idMarca: string): Promise<IServerResponse<IPublication[]>> {
    try {

        console.log("idMarca", idMarca);
        
        const result = await Publication.find({ marcaId: idMarca }).populate('socialMedia.socialMedia').populate('files').populate('creatorId') ;

        console.log("result", result);
        if (!result) {
            return { data: [], isOk: true, message: "No hay publicaciones" };
        }

        return {
            data: JSON.parse(JSON.stringify(result)) as IPublication[],
            isOk: true,
            message: "Leer publicaciones"
        };

    } catch (error: any) {
        console.log("error", error);
        return { data: null, isOk: false, message: "Error - No es posible leer las publicaciones en este momento" };
    }
}
