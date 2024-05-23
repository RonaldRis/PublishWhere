import { NextRequest, NextResponse } from "next/server";
import { File, Marca, Publication, SocialMediaAccount, Oauth } from "@/lib/models/models";
import { IPublication } from "shared-lib/models/publicaction.model";
import { IFile } from "shared-lib/models/file.model";
import { IMarca } from "shared-lib/models/marca.model";

export async function GET(req: NextRequest) {


    const data = await Marca.find({}).populate("equipo").populate("admin").sort({createdAt:-1});
    const dataParse = JSON.parse(JSON.stringify(data)) as IMarca[];
    return NextResponse.json({files:dataParse});
}