import clientPromise from '@/lib/mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';


export async function GET(request: Request, response: Response) {

    if (process.env.NODE_ENV !== 'production') {


        try {
            console.log('Eliminando colecciones...');
            console.log('Eliminando colecciones...');
            console.log('Eliminando colecciones...');
            console.log('Eliminando colecciones...');
            var client = await clientPromise;
            const db = client.db();

            // Eliminar la colección 'xd'
            await db.collection('accounts').drop();
            await db.collection('sessions').drop();
            await db.collection('users').drop();

            return NextResponse.json({ message: 'Colecciones eliminadas exitosamente' });
        } catch (error) {
            console.error('Error al eliminar las colecciones:', error);
            return NextResponse.json({ message: 'Error al eliminar las colecciones' }, { status: 500 });
        }
    }


    return NextResponse.json({ message: 'No se puede eliminar colecciones en producción' }, { status: 403 });


}