"use server";

import { IFile, IFilePost } from "../models/file.model";
import { File, Marca } from "../models/models";
import { IServerResponse } from "./ServerResponse";



export async function fetchFileAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {

        var result = await File.findById(fileId);
        if (!result) {
            return { data: null, isOk: false, error: "No existe el archivo" };
        }

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            error: null
        };

    } catch (error: any) {
        return { data: null, isOk: false, error: "No existe el archivo" };
    }
}
export async function fetchAllFilesByMarcaAction(marcaId: string, trashOnly: boolean = false, favoriteOnly: boolean = false): Promise<IServerResponse<IFile[]>> {
    try {

        //TODO: CAMBIAR REQUEST PARA OBTENER SOLO LOS FAVORITOS

        const filesQuery = await File.find<IFile>({
            marcaId: marcaId,
            shouldDelete: trashOnly
        }).populate('creatorId');
        const files = JSON.parse(JSON.stringify(filesQuery)) as IFile[];
        return { data: files, isOk: true, error: null };

    } catch (error: any) {
        return { data: [], isOk: false, error: "No hay archivos" };
    }
}

export async function fetchMyFilesAction(userId: string): Promise<IServerResponse<IFile[]>> {
    try {
        // connectToDB();

        const filesQuery = await File.find({ creatorId: userId });
        const result = JSON.parse(JSON.stringify(filesQuery)) as IFile[];

        return { data: result, isOk: true, error: null };

    } catch (error: any) {
        return { data: [], isOk: false, error: "No hay archivos" };
    }
}

//Works for both creating File and updating Marca reference
export async function postCreateFileAction(newFile: IFilePost): Promise<IServerResponse<IFile>> {

    try {

        const marca = await Marca.findById(newFile.marcaId);
        if (!marca) {
            return { data: null, isOk: false, error: "No existe la marca" };
        }

        const newFileMongo = await File.create(newFile);
        //Validar que si se ha creado el archivo
        if (!newFileMongo) {
            return { data: null, isOk: false, error: "No se ha podido crear el archivo" };
        }
        marca.files.push(newFileMongo);
        await marca.save();


        return {
            data: JSON.parse(JSON.stringify(newFileMongo)) as IFile,
            isOk: true,
            error: null
        };


    } catch (error: any) {
        return { data: null, isOk: false, error: "Ya existe ese archivo" };
    }
}

export async function sendToTrashFileAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {


        const result = await File.findByIdAndUpdate(fileId, { shouldDelete: true }, { new: true });

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            error: "Enviado a la papelera con éxito"
        };
    } catch (error: any) {
        return { data: null, isOk: false, error: "No es posible eliminar el archivo" };
    }
}




export async function restoreTrashFileAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {


        const result = await File.findByIdAndUpdate(fileId, { shouldDelete: false }, { new: true });

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            error: "Enviado a la papelera con éxito"
        };
    } catch (error: any) {
        return { data: null, isOk: false, error: "No es posible eliminar el archivo" };
    }
}

export async function putFileAsUsedAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {

        const result = await File.findByIdAndUpdate(fileId, { alreadyUsed: true }, { new: true });

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            error: "Archivo marcado como usado"
        };
    } catch (error: any) {
        return { data: null, isOk: false, error: "No es posible usar el archivo" };
    }
}

export async function deleteFileAction(fileId: string): Promise<IServerResponse<boolean>> {
    try {



        const result = await File.deleteOne({ _id: fileId });
        console.log("Delete count: ", result.deletedCount)

        if (result.deletedCount == 0) {
            return { data: false, isOk: false, error: "No es posible eliminar el archivo" };
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

