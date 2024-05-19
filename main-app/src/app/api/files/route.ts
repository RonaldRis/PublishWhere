import { NextRequest, NextResponse } from "next/server";
import { File, Publication } from "@/lib/models/models";
import { IPublication } from "shared-lib/models/publicaction.model";
import { IFile } from "shared-lib/models/file.model";

export async function GET(req: NextRequest) {
    const data = await File.find({}).sort({createdAt:-1});
    const publicaciones = JSON.parse(JSON.stringify(data)) as IFile[];
    return NextResponse.json({data:publicaciones});
}