import { NextRequest, NextResponse } from "next/server";
import { File } from "@/lib/models/models";
import { IFile } from "shared-lib/models/file.model";
import axios from "axios";
import { getMediaUrl } from "@/lib/constantes";
import { file } from "googleapis/build/src/apis/file";

export async function GET(req: NextRequest) {
    const filesQuery = await File.find({});
    const files = JSON.parse(JSON.stringify(filesQuery)) as IFile[];

    const promises = files.map(async (file) => {
        console.log("CHECK FILES", file);
        const response = await axios({
            url: getMediaUrl(file.bucketFileName),
            method: 'GET',
            responseType: 'arraybuffer', // change to arraybuffer
        });

        const fileSize = Buffer.byteLength(response.data); // get file size
        console.log("File size: ", fileSize);

        await File.updateOne({ _id: file._id }, { $set: { size : fileSize } }); // update file size

    });

    await Promise.all(promises);

    const filesQueryUpdated = await File.find({});
    const filesUpdated = JSON.parse(JSON.stringify(filesQueryUpdated)) as IFile[];



    return NextResponse.json({ data: filesUpdated });
}