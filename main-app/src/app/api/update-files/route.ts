import { use } from 'react';
import { IFile, IFilePost } from '../../../lib/models/file.model';
import { fetchAllFilesByMarcaAction, postCreateFileAction } from '@/lib/actions/files.actions';
import { postCrearMarcaAction } from '@/lib/actions/marcas.actions';
import { IMarca } from '@/lib/models/marca.model';
import { Marca, User } from '@/lib/models/models';
import clientPromise from '@/lib/mongoose';
import { NextResponse } from 'next/server';


export async function GET(request: Request, response: Response) {

    if (process.env.NODE_ENV !== 'production') {


        try {
            console.log('Eliminando colecciones...');
            console.log('Eliminando colecciones...');
            var client = await clientPromise;
            const db = client.db();

            // // Eliminar la colección 'xd'
            // await db.collection('accounts').drop();
            // await db.collection('sessions').drop();
            // await db.collection('users').drop();
            await db.collection('files').drop();

            var marcasAll = await Marca.find({});
            const marcas = JSON.parse(JSON.stringify(marcasAll)) as IMarca[];
            const users = await User.find({});

            const bucketFileName = "8bd26652e95f6d57f8c8a0840ceb3f9533fe7d25116ce6c968708a485a954e5c";

            const fileImage: IFilePost = {
                name: "imagen1 foto random de perfils xd",
                bucketFileName: bucketFileName,

                creatorId: marcas[0].admin as string,
                marcaId: marcas[0]._id as string,
                type: "image",
                alreadyUsed: false,
            }


            const fileVideo: IFilePost = {
                name: "video random",
                bucketFileName: bucketFileName,
                creatorId: marcas[0].admin as string,
                marcaId: marcas[0]._id as string,
                type: "video",
                alreadyUsed: false,
            }



            await postCreateFileAction(fileVideo)
            await postCreateFileAction({ ...fileImage, alreadyUsed: true })
            await postCreateFileAction({ ...fileImage, creatorId: users[0]._id as string })
            await postCreateFileAction({ ...fileImage, creatorId: users[1]._id as string })
            await postCreateFileAction(fileVideo)
            await postCreateFileAction(fileImage)
            await postCreateFileAction(fileImage)

            const allFiles = await fetchAllFilesByMarcaAction(marcas[0]._id as string);
            console.log(allFiles);

            const marca0 = await Marca.findById(fileImage.marcaId).populate("files");


            return NextResponse.json({
                allFiles: allFiles,
                marca0: marca0
            });
        } catch (error) {
            console.error('Error al eliminar las colecciones:', error);
            return NextResponse.json({ message: 'Error al eliminar las colecciones' }, { status: 500 });
        }
    }


    return NextResponse.json({ message: 'No se puede eliminar colecciones en producción' }, { status: 403 });


}