import { File } from '@/lib/models/models';
import { NextResponse } from 'next/server';


export async function GET(request: Request, response: Response) {

    if (process.env.NODE_ENV !== 'production') {


        try {
            
            const allFiles = await File.find({});
            console.log(allFiles);


            return NextResponse.json({
                allFiles: allFiles,
            });
        } catch (error) {
            console.error('Error al eliminar las colecciones:', error);
            return NextResponse.json({ message: 'Error al eliminar las colecciones' }, { status: 500 });
        }
    }


    return NextResponse.json({ message: 'No se puede eliminar colecciones en producción' }, { status: 403 });


}