"use server";

import { IMarca } from "../models/marca.model";
import { Marca, User } from "../models/models";
import { IServerResponse } from "../models/ServerResponse";








export async function fetchMarca(marcaId: string): Promise<IServerResponse<IMarca>> {
    try {

        var result = await Marca.findOne({ id: marcaId })
        return {
            result: JSON.parse(JSON.stringify(result)) as IMarca,
            isOk: true,
            error: null
        };

    } catch (error: any) {
        return { result: null, isOk: false, error: "No hay marca" };
    }
}

export async function fetchAllMarcas(): Promise<IServerResponse<IMarca[]>> {
    try {
        // connectToDB();

        const marcasQuery = await Marca.find({}).populate('admin').populate('equipo');
        const marcas = JSON.parse(JSON.stringify(marcasQuery)) as IMarca[];
        return { result: marcas, isOk: true, error: null };

    } catch (error: any) {
        return { result: [], isOk: false, error: "No hay marcas" };
    }
}


export async function fetchMisMarcas(userId: string): Promise<IServerResponse<IMarca[]>> {
    try {
        // connectToDB();

        const marcasQuery = await Marca.find({ equipo: { $in: [userId] } }).populate('admin').populate('equipo');
        const result = JSON.parse(JSON.stringify(marcasQuery)) as IMarca[];

        return { result: result, isOk: true, error: null };

    } catch (error: any) {
        return { result: [], isOk: false, error: "No hay marcas" };
    }
}

//INTERFAZ DE QUERIES EJEMPLO: IServerResponse SAMPLE RESPONSE
export async function postCrearMarca(userId: string, marca: string): Promise<IServerResponse<IMarca>> {

    try {


        const resultQuery = await Marca.create({ name: marca, admin: userId, equipo: [userId] });
        const result = JSON.parse(JSON.stringify(resultQuery)) as IMarca;

        return { result: result, isOk: true, error: null };


    } catch (error: any) {
        return { result: null, isOk: false, error: "Ya existe esa marca" };
    }
}


export async function postNewTeamMembersOnMarca(marcaId: string, userIds: string[]): Promise<IServerResponse<IMarca>> {
    try {



        const result = await Marca.findOneAndUpdate(
            { id: marcaId },
        );

        userIds.forEach(async (userId) => {
            result.equipo.push(userId);
        })


        result.save();

        const resultQuery = await Marca.findOne({ id: marcaId }).populate('admin').populate('equipo');
        console.log(resultQuery);

        return {
            result: JSON.parse(JSON.stringify(resultQuery)) as IMarca,
            isOk: true,
            error: "Agreagado al equipo con exito"
        };

    } catch (error: any) {
        return { result: null, isOk: false, error: "No es posible agregar el miembro al equipo" };
    }
}