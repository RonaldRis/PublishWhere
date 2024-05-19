import { NextRequest, NextResponse } from "next/server";
import { File, Marca, Publication, SocialMediaAccount, Oauth } from "@/lib/models/models";
import { IPublication } from "shared-lib/models/publicaction.model";
import { IFile } from "shared-lib/models/file.model";
import { IMarca } from "shared-lib/models/marca.model";

export async function GET(req: NextRequest) {

    // await SocialMediaAccount.deleteMany({});
    // await Marca.deleteMany({});
    // await Publication.deleteMany({});
    // await Oauth.deleteMany({});
    // await File.deleteMany({});

    const data = await File.find({}).sort({createdAt:-1});
    const dataParse = JSON.parse(JSON.stringify(data)) as IFile[];
    return NextResponse.json({data:dataParse});
}