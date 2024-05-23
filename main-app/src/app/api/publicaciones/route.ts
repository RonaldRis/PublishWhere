import { NextRequest, NextResponse } from "next/server";
import { Publication, File } from "@/lib/models/models";
import { IPublication } from "shared-lib/models/publicaction.model";

export async function GET(req: NextRequest) {
    
    //Ahora por cada idsFiles quiero buscar en File collection ese objeto
    const query = await Publication.find().populate("files"); 

    const data = JSON.parse(JSON.stringify(query)) as IPublication[];
    return NextResponse.json({data:data});
}