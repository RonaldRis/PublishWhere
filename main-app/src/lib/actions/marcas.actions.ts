"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";
import { IMarca } from "../models/marca.model";
import { Marca } from "../models";






export async function fetchMarca(marcaId: string) : Promise<IMarca> {
    try {
        // connectToDB();

        var result = await Marca.findOne({ id: marcaId })
        return JSON.parse(JSON.stringify(result)) as IMarca;

    } catch (error: any) {
        throw new Error(`Failed to fetch marca: ${error.message}`);
    }
}

export async function fetchAllMarcas()  {
    try {
        // connectToDB();

        const marcas =  await Marca.find({}).populate('admin').populate('equipo') ;
        console.log(marcas);
        return JSON.parse(JSON.stringify(marcas)) as IMarca[];

    } catch (error: any) {
        throw new Error(`Failed to fetch marca: ${error.message}`);
    }
}


export async function fetchMisMarcas(userId: string) {
    try {
        // connectToDB();

        const marcas =  await Marca.find({ equipo: { $in: [userId] } }).populate('admin').populate('equipo');
        return JSON.parse(JSON.stringify(marcas)) as IMarca[];

    } catch (error: any) {
        throw new Error(`Failed to fetch marca: ${error.message}`);
    }
}

export async function postCrearMarca(userId: string, marca: string) {
    try {
        // connectToDB();

        
        const result = await Marca.create({ name: marca, admin: userId, equipo: [userId] });
        return JSON.parse(JSON.stringify(result)) as IMarca;



    } catch (error: any) {
        throw new Error(`Failed to fetch marca: ${error.message}`);
    }
}