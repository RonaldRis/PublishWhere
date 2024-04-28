"use server";

import { IFile, IFilePost } from "../models/file.model";
import { File, Marca } from "../models/models";
import { IServerResponse } from "./ServerResponse";



export async function fetch_URL_SOCIAL_MEDIA_CONNECTION_SERVICE(): Promise<IServerResponse<string>> {
    try {
        return { data: process.env.URL_SOCIAL_MEDIA_CONNECTION_SERVICE!, isOk: true, message: null };

    } catch (error: any) {
        return { data: null, isOk: false, message: "No existe el URL" };
    }
}