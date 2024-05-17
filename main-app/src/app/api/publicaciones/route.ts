import { Publication } from "@/lib/models/models";
import { NextResponse } from "next/server";
import { IPublication } from "shared-lib/models/publicaction.model";


export async function GET(req:Response){


    const data = await Publication.find({}).sort({createdAt:-1});
    const publicaciones = JSON.parse(JSON.stringify(data)) as IPublication[];
    return NextResponse.json({data:publicaciones});

}