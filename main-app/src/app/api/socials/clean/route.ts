import { File, Oauth, SocialMediaAccount } from '@/lib/models/models';
import { NextResponse } from 'next/server';


export async function GET(request: Request, response: Response) {

    const socials = await SocialMediaAccount.deleteMany({});
    const oauth = await Oauth.deleteMany({});



    return NextResponse.json({ socialMediaAccounts:socials, oauth: oauth});


}