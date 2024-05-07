import { File, Oauth, SocialMediaAccount } from '@/lib/models/models';
import { NextResponse } from 'next/server';


export async function GET(request: Request, response: Response) {

    const socials = await SocialMediaAccount.find({}).populate('userCreator').populate('oauthID');
    const oauth = await Oauth.find({});



    return NextResponse.json({ socialMediaAccounts:socials, oauths: oauth});


}