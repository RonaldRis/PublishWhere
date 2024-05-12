import { File, Marca, Oauth, SocialMediaAccount } from '@/lib/models/models';
import { NextResponse } from 'next/server';


export async function GET(request: Request, response: Response) {

    const socials = await SocialMediaAccount.deleteMany({});
    const oauth = await Oauth.deleteMany({});
    var marcas = await Marca.find({});
    marcas.forEach(async (marca) => {
        marca.socialMedia = [];
        await marca.save();
    });
    marcas = await Marca.find({});



    return NextResponse.json({ socialMediaAccounts:socials, oauth: oauth, marcas: marcas});


}