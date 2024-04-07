"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { allowedFileTypes } from "../constantes";
import { IServerResponse } from "./ServerResponse";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

import { getServerSessionAuth } from "@/lib/auth";
import { postCreateFileAction } from "@/lib/actions/files.actions";
import { IFile } from "../models/file.model";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

type SignedURLResponse = { url: string; file: IFile };

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
  marcaId: string;
};

export const getSignedURL = async ({
  fileType,
  fileSize,
  checksum,
  marcaId,
}: GetSignedURLParams): Promise<IServerResponse<SignedURLResponse>> => {
  const session = await getServerSessionAuth();

  if (!fileSize || !fileType || !checksum || !marcaId)
    return { data: null, isOk: false, error: "Faltan datos" };

  if (!session) {
    return {
      data: null,
      isOk: false,
      error: "No autenticado",
    };
  }

  if (!allowedFileTypes.includes(fileType)) {
    return {
      data: null,
      isOk: false,
      error: "Tipo de archivo no permitido",
    };
  }

  const fileName = crypto.randomBytes(32).toString("hex");
  console.log(fileName);

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,

    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  const segundoExpire = fileSize / (1024 * 1024); //Cantidad de MB (1 segundo por MB)

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: segundoExpire } // 60 seconds
  );

  console.log("URL: ", url);

  const imageOrVideo = fileType.startsWith("image") ? "image" : "video";

  const fileEmptyWithLink = {
    name: fileName,
    type: imageOrVideo,
    url: url.split("?")[0],
    marcaId: marcaId,
    creatorId: session.user.id,
    alreadyUsed: false,
  };
  console.log(fileEmptyWithLink);
  const resultFile = await postCreateFileAction(fileEmptyWithLink);
  console.log(resultFile);
  if (!resultFile.isOk) {
    return { failure: "Error al subir el archivo" };
  }

  console.log({ success: { url, id: resultFile.data?._id! } });

  return { success: { url, id: resultFile.data?._id! } };
};
