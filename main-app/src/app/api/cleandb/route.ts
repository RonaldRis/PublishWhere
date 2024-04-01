import { postCrearMarca } from '@/lib/actions/marcas.actions';
import { Marca, User } from '@/lib/models/models';
import clientPromise from '@/lib/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { use } from 'react';


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
            await db.collection('marcas').drop();
            await db.collection('assets').drop();

            const allUsers = await User.find({});
            const userRonald = allUsers.find(user => user.email === "rrris402@gmail.com");


            console.log(userRonald);
            await postCrearMarca(userRonald._id, "Ris")
            await postCrearMarca(userRonald._id, "Marcela Peraz")
            await postCrearMarca(userRonald._id.toString(), "Kibo")

            const allMarcas = await db.collection('marcas').find({}).toArray();
            const allMarcas2 = await db.collection('marcas').find({});
            const allMarcasModel = await Marca.find({});

            const marcas = await Marca.find({}).populate('admin').populate('equipo');
            console.log(marcas);

            return NextResponse.json({
                message: 'Colecciones eliminadas exitosamente',
                allUser: allUsers,
                marcasPopulate: marcas
            });
        } catch (error) {
            console.error('Error al eliminar las colecciones:', error);
            return NextResponse.json({ message: 'Error al eliminar las colecciones' }, { status: 500 });
        }
    }


    return NextResponse.json({ message: 'No se puede eliminar colecciones en producción' }, { status: 403 });


}