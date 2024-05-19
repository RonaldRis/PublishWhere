"use server";

import { IFile, IFilePost } from "shared-lib/models/file.model";
import { File, Marca, Publication } from "@/lib/models/models";
import { IServerResponse } from "./ServerResponse";
import { IPublication } from "shared-lib/models/publicaction.model";


export async function putFileRenameAction(fileId: string, name: string): Promise<IServerResponse<IFile>> {
    try {

        var result = await File.findById(fileId).populate('creatorId');;

        if (!result) {
            return { data: null, isOk: false, message: "No existe el archivo" };
        }

        result.name = name;
        await result.save();

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            message: null
        };

    } catch (error: any) {
        return { data: null, isOk: false, message: "No existe el archivo" };
    }
}


export async function fetchFileAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {

        var result = await File.findById(fileId).populate('creatorId');
        if (!result) {
            return { data: null, isOk: false, message: "No existe el archivo" };
        }

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            message: null
        };

    } catch (error: any) {
        return { data: null, isOk: false, message: "No existe el archivo" };
    }
}
export async function fetchAllFilesByMarcaAction(marcaId: string, trashOnly: boolean = false): Promise<IServerResponse<IFile[]>> {
    try {

        //TODO: CAMBIAR REQUEST PARA OBTENER SOLO LOS FAVORITOS

        const filesQuery = await File.find<IFile>({
            marcaId: marcaId,
            shouldDelete: trashOnly
        }).populate('creatorId');
        const files = JSON.parse(JSON.stringify(filesQuery)) as IFile[];
        return { data: files, isOk: true, message: null };

    } catch (error: any) {
        return { data: [], isOk: false, message: "No hay archivos" };
    }
}



export async function fetchAllFilesNOTUsedByMarcaAction(marcaId: string): Promise<IServerResponse<IFile[]>> {
    try {

        //TODO: CHECK

        const filesQuery = await File.find({ marcaId: marcaId, alreadyUsed: false }).populate('creatorId');
        const files = JSON.parse(JSON.stringify(filesQuery)) as IFile[];


        return { data: files, isOk: true, message: null };

    } catch (error: any) {
        return { data: [], isOk: false, message: "No hay archivos" };
    }
}


export async function fetchAllFilesUsedByMarcaAction(marcaId: string): Promise<IServerResponse<IFile[]>> {
    try {

        //TODO: CHECK

        const filesQuery = await File.find({ marcaId: marcaId, alreadyUsed: true }).populate('creatorId');
        const files = JSON.parse(JSON.stringify(filesQuery)) as IFile[];


        return { data: files, isOk: true, message: null };

    } catch (error: any) {
        return { data: [], isOk: false, message: "No hay archivos" };
    }
}


// export async function fetchAllFilesPostedByMarcaAction(marcaId: string): Promise<IServerResponse<IFile[]>> {
//     try {

//         //TODO: CHECK

//         const publicacionesQuery = await Publication.find({ marcaId: marcaId, alreadyPosted: true }).populate('files');
//         const publicaciones = JSON.parse(JSON.stringify(publicacionesQuery)) as IPublication[];

//         const uniqueFiles: { [key: string]: IFile } = {};

//         //Los archivos tienen que se unicos
//         publicaciones.forEach((publicacion) => {
//             publicacion.files.forEach((file) => {
//                 uniqueFiles[file._id] = file;
//             });
//         });

//         const files = Object.values(uniqueFiles);


//         return { data: files, isOk: true, message: null };

//     } catch (error: any) {
//         return { data: [], isOk: false, message: "No hay archivos" };
//     }
// }


export async function fetchAllFilesScheduleByMarcaAction(marcaId: string): Promise<IServerResponse<IFile[]>> {
    try {

        const data = await Publication.find({alreadyPosted:false, marcaId:marcaId}).sort({createdAt:-1}).populate("files");

        var idsFiles:string[] = [];
        data.map((pub:IPublication)=>{
            pub.files.map((file)=>{
                idsFiles.push(file._id);
            });
        });
        //Ahora por cada idsFiles quiero buscar en File collection ese objeto
        const filesQuery = await File.find({_id:{$in:idsFiles}}).populate("creatorId"); 
    
        const files = JSON.parse(JSON.stringify(filesQuery)) as IFile[];
        
    

        return { data: files, isOk: true, message: null };


    } catch (error: any) {
        return { data: [], isOk: false, message: "No hay archivos" };
    }
}

export async function fetchMyFilesAction(userId: string): Promise<IServerResponse<IFile[]>> {
    try {
        // connectToDB();

        const filesQuery = await File.find({ creatorId: userId }).populate('creatorId');
        const result = JSON.parse(JSON.stringify(filesQuery)) as IFile[];

        return { data: result, isOk: true, message: null };

    } catch (error: any) {
        return { data: [], isOk: false, message: "No hay archivos" };
    }
}

//Works for both creating File and updating Marca reference
export async function postCreateFileAction(newFile: IFilePost): Promise<IServerResponse<IFile>> {

    try {

        const marca = await Marca.findById(newFile.marcaId);
        if (!marca) {
            return { data: null, isOk: false, message: "No existe la marca" };
        }

        const newFileMongo = await File.create(newFile);
        //Validar que si se ha creado el archivo
        if (!newFileMongo) {
            return { data: null, isOk: false, message: "No se ha podido crear el archivo" };
        }
        marca.files.push(newFileMongo);
        await marca.save();


        return {
            data: JSON.parse(JSON.stringify(newFileMongo)) as IFile,
            isOk: true,
            message: null
        };


    } catch (error: any) {
        return { data: null, isOk: false, message: "Ya existe ese archivo" };
    }
}

export async function sendToTrashFileAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {


        const result = await File.findByIdAndUpdate(fileId, { shouldDelete: true }, { new: true });

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            message: "Enviado a la papelera con éxito"
        };
    } catch (error: any) {
        return { data: null, isOk: false, message: "No es posible eliminar el archivo" };
    }
}




export async function restoreTrashFileAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {


        const result = await File.findByIdAndUpdate(fileId, { shouldDelete: false }, { new: true });

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            message: "Enviado a la papelera con éxito"
        };
    } catch (error: any) {
        return { data: null, isOk: false, message: "No es posible eliminar el archivo" };
    }
}

export async function putFileAsUsedAction(fileId: string): Promise<IServerResponse<IFile>> {
    try {

        const result = await File.findByIdAndUpdate(fileId, { alreadyUsed: true }, { new: true });

        return {
            data: JSON.parse(JSON.stringify(result)) as IFile,
            isOk: true,
            message: "Archivo marcado como usado"
        };
    } catch (error: any) {
        return { data: null, isOk: false, message: "No es posible usar el archivo" };
    }
}

export async function deleteFileAction(fileId: string): Promise<IServerResponse<boolean>> {
    try {



        const result = await File.deleteOne({ _id: fileId });
        console.log("Delete count: ", result.deletedCount)

        if (result.deletedCount == 0) {
            return { data: false, isOk: false, message: "No es posible eliminar el archivo" };
        }
        return {
            data: true,
            isOk: true,
            message: "Eliminado con exito"
        };

    } catch (error: any) {
        return { data: false, isOk: false, message: "No es posible eliminar el miembro al equipo" };
    }
}

