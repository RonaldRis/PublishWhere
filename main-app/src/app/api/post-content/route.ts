import { createResponse, IServerResponse } from 'shared-lib';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { Publication } from '@/lib/models/models';
import { IPublication } from 'shared-lib/models/publicaction.model';

const CONTENT_UPLOAD_URL = process.env.URL_CONTENT_UPLOAD_SERVICE;


export async function GET(req: NextRequest) {

    //Obtengo todos los datos necesarios
    const { searchParams } = new URL(req.url)
    const idPublicacion = searchParams.get('id')
    console.log(req.url)

    console.log("\n\nPOST /api/post-content");
    console.log("idPublicacion", idPublicacion);

    if (!idPublicacion) {
        return NextResponse.json(createResponse(false, 'ID de publicación no proporcionado', null));
    }


    const result = await Publication.findById(idPublicacion).populate('socialMedia.socialMedia');
    const publicationSelected = JSON.parse(JSON.stringify(result)) as IPublication;


    if (!result) {
        return NextResponse.json(createResponse(false, 'Publicación no encontrada', null));
    }



    //Inicio proceso de publicación - Evito multiples publicaciones
    await Publication.findByIdAndUpdate(idPublicacion, { isPostingInProgress: true });


    console.log("result", publicationSelected);


    //Publico en todas las redes sociales seleccionadas
    const promises = publicationSelected.socialMedia.map((socialMedia: any) => {
        switch (socialMedia.provider) {
            case 'twitter':
                return axios.post(`${CONTENT_UPLOAD_URL}/publish/twitter`, {
                    idPublicacion: idPublicacion,
                    idRedSocial: socialMedia.socialMedia
                });

            case 'youtube':
                return axios.post(`${CONTENT_UPLOAD_URL}/publish/youtube`, {
                    idPublicacion: idPublicacion,
                    idRedSocial: socialMedia.socialMedia
                });

            default:
                return Promise.resolve();
        }
    });



    try {
        const values = await Promise.all(promises);

        //Finalizo proceso de publicación
        await Publication.findByIdAndUpdate(result._id, { isPostingInProgress: false, alreadyPosted: true });

        const responses: any[] = []
        values.map((value) => {
            console.log('Response Request', value?.data);
            responses.push(value?.data);

        });
        return NextResponse.json(createResponse(true, 'Publicación realizada', responses));
    } catch (error) {
        console.log('Error', error);
        return NextResponse.json(createResponse(false, 'Error al publicar', null), { status: 500 });
    }
}
