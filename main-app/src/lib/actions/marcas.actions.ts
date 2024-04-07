"use server";

import { IMarca } from "../models/marca.model";
import { Marca, User } from "../models/models";
import { IServerResponse } from "./ServerResponse";








export async function fetchMarcaAction(marcaId: string): Promise<IServerResponse<IMarca>> {
    try {

        var result = await Marca.findOne({ _id: marcaId }).populate('admin').populate('equipo');
        if (!result) {
            return { data: null, isOk: false, error: "No hay marca" };
        }

        return {
            data: JSON.parse(JSON.stringify(result)) as IMarca,
            isOk: true,
            error: null
        };

    } catch (error: any) {
        return { data: null, isOk: false, error: "No hay marca" };
    }
}

export async function fetchAllMarcasAction(): Promise<IServerResponse<IMarca[]>> {
    try {
        // connectToDB();

        const marcasQuery = await Marca.find({}).populate('admin').populate('equipo');
        const marcas = JSON.parse(JSON.stringify(marcasQuery)) as IMarca[];
        return { data: marcas, isOk: true, error: null };

    } catch (error: any) {
        return { data: [], isOk: false, error: "No hay marcas" };
    }
}


export async function fetchMisMarcasAction(userId: string): Promise<IServerResponse<IMarca[]>> {
    try {
        // connectToDB();

        const marcasQuery = await Marca.find({ equipo: { $in: [userId] } }).populate('admin').populate('equipo');
        const result = JSON.parse(JSON.stringify(marcasQuery)) as IMarca[];

        return { data: result, isOk: true, error: null };

    } catch (error: any) {
        return { data: [], isOk: false, error: "No hay marcas" };
    }
}

//INTERFAZ DE QUERIES EJEMPLO: IServerResponse SAMPLE RESPONSE
export async function postCrearMarcaAction(userId: string, marca: string): Promise<IServerResponse<IMarca>> {

    try {


        const resultQuery = await Marca.create({ name: marca, admin: userId, equipo: [userId] });
        const result = JSON.parse(JSON.stringify(resultQuery)) as IMarca;

        return { data: result, isOk: true, error: null };


    } catch (error: any) {
        return { data: null, isOk: false, error: "Ya existe esa marca" };
    }
}

export async function deleteMarcaAction(marcaId: string): Promise<IServerResponse<boolean>> {
    try {



        const result = await Marca.deleteOne({ _id: marcaId });
        console.log("Delete count: ", result.deletedCount)

        if (result.deletedCount == 0) {
            return { data: false, isOk: false, error: "No es posible eliminar la marca" };
        }
        return {
            data: true,
            isOk: true,
            error: "Eliminado con exito"
        };

    } catch (error: any) {
        return { data: false, isOk: false, error: "No es posible eliminar el miembro al equipo" };
    }
}


export async function renameMarcaAction(marcaId: string, newName:string): Promise<IServerResponse<IMarca>> {
    try {

        const result = await Marca.findByIdAndUpdate(
            marcaId,
            { name: newName },
            { new: true, useFindAndModify: false }
        );

        return {
            data: JSON.parse(JSON.stringify(result)) as IMarca,
            isOk: true,
            error: "Renombrado con exito"
        };

    } catch (error: any) {
        return { data: null, isOk: false, error: "No es posible renombrar la marca" };
    }
}



export async function postNewTeamMembersOnMarcaAction(marcaId: string, userIds: string[]): Promise<IServerResponse<IMarca>> {
    try {

        const result = await Marca.findByIdAndUpdate(
            marcaId,
            { $addToSet: { equipo: { $each: userIds } } },
            { new: true, useFindAndModify: false }
        );
        
        
        //Ahora vuelvo a buscar la marca y populo el admin y el equipo
        const resultPopulate = await Marca.findOne({ _id: marcaId }).populate('admin').populate('equipo');
        if (!resultPopulate) {
            return { data: null, isOk: false, error: "No es posible agregar el miembro al equipo" };
        }

        return {
            data: JSON.parse(JSON.stringify(resultPopulate)) as IMarca,
            isOk: true,
            error: "Agreagado al equipo con exito"
        };


    } catch (error: any) {
        return { data: null, isOk: false, error: "No es posible agregar el miembro al equipo" };
    }
}


export async function deleteTeamMembersOnMarcaAction(marcaId: string, userId: string): Promise<IServerResponse<IMarca>> {
    try {



        const result = await Marca.findOneAndUpdate(
            { _id: marcaId },
            { $pull: { equipo: userId } },
            { new: true, useFindAndModify: false }
        );

        return {
            data: JSON.parse(JSON.stringify(result)) as IMarca,
            isOk: true,
            error: "Eliminado del  equipo con exito"
        };

    } catch (error: any) {
        return { data: null, isOk: false, error: "No es posible borrar el miembro al equipo" };
    }
}

