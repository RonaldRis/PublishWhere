import { use } from 'react';
import { IFile, IFilePost } from '../../../lib/models/file.model';
import { fetchAllFilesByMarcaAction, postCreateFileAction } from '@/lib/actions/files.actions';
import { postCrearMarcaAction } from '@/lib/actions/marcas.actions';
import { IMarca } from '@/lib/models/marca.model';
import { File, Marca, User } from '@/lib/models/models';
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

            // Quiero eliminar de todas las marcas, sus campos files que son un array de referencias a la collecion de files
            await Marca.updateMany({}, { $unset: { files: "" } });
            var marcasAll = await Marca.find({}).populate('files').populate('equipo');


            const marcas = JSON.parse(JSON.stringify(marcasAll)) as IMarca[];

            const allFiles = await File.find({});


            return NextResponse.json({
                allFiles: allFiles,
                marca0: marcas
            });
        } catch (error) {
            console.error('Error al eliminar las colecciones:', error);
            return NextResponse.json({ message: 'Error al eliminar las colecciones' }, { status: 500 });
        }
    }


    return NextResponse.json({ message: 'No se puede eliminar colecciones en producción' }, { status: 403 });


}