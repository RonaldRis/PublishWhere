import { File, Marca, Oauth, SocialMediaAccount } from '@/lib/models/models';
import { NextResponse } from 'next/server';


export async function GET(request: Request, response: Response) {

    const marcas = await Marca.find({}).populate('socialMedia');



    return NextResponse.json({ marcas:marcas});


}