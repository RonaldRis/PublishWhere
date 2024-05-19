import { NextRequest, NextResponse } from "next/server";
import { Publication, File } from "@/lib/models/models";
import { IPublication } from "shared-lib/models/publicaction.model";

export async function GET(req: NextRequest) {
    const data = await Publication.find({alreadyPosted:false}).sort({createdAt:-1}).populate("files");

    var idsFiles:string[] = [];
    data.map((pub:IPublication)=>{
        pub.files.map((file)=>{
            idsFiles.push(file._id);
        });
    });
    //Ahora por cada idsFiles quiero buscar en File collection ese objeto
    const filesQuery = await File.find({_id:{$in:idsFiles}}).populate("creatorId"); 

    const files = JSON.parse(JSON.stringify(filesQuery)) as File[];
    





    const publicaciones = JSON.parse(JSON.stringify(data)) as IPublication[];
    return NextResponse.json({data:files});
}