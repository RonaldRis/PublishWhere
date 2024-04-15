"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { allowedFileTypes } from "../constantes";
import { IServerResponse } from "./ServerResponse";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getServerSessionAuth } from "@/lib/auth";
import { postCreateFileAction } from "@/lib/actions/files.actions";
import { IFile, IFilePost } from "../models/file.model";

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION_AWS!,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_AWS!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY_AWS!,
  },
});




////// FUNCIONES DE S3 //////

type SignedURLResponse = { signedURL: string; };

type GetSignedURLParams = {
  fileData: {
    fileType: string;
    fileSize: number;
    checksum: string;
  };
  newFile: IFilePost;
};

export const getSignedURL = async ({
  newFile,
  fileData: { fileSize, fileType, checksum },
}: GetSignedURLParams): Promise<IServerResponse<SignedURLResponse>> => {


  const session = await getServerSessionAuth();

  if (!fileSize || !fileType || !checksum || !newFile.marcaId)
    return { data: null, isOk: false, message: "Faltan datos" };


  if (!session) {
    return {
      data: null,
      isOk: false,
      message: "No autenticado",
    };
  }


  if (!allowedFileTypes.includes(fileType)) {
    return {
      data: null,
      isOk: false,
      message: "Tipo de archivo no permitido",
    };
  }

  console.log("TIPO ACEPTADO")
  console.log("FILE SIZE: ", fileSize);

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME_AWS!,
    Key: newFile.bucketFileName,
    ContentType: fileType,
    ContentLength: fileSize,
    ChecksumSHA256: checksum,
  });

  var segundoExpire = fileSize / (1024 * 1024)*100; //Cantidad de MB (1 segundo por MB)
  segundoExpire = Math.ceil(segundoExpire); 

  if(segundoExpire < 60)
    segundoExpire = 60;

  console.log("EXPIRE: ", segundoExpire);

  const url = await getSignedUrl(
    s3Client,
    putObjectCommand,
    { expiresIn: segundoExpire } // TIENE QUE SER UN ENTERO O FALLA
  );

  console.log("URL: ", url);
  

  return {
    data: { signedURL: url },
    isOk: true,
    message: null,
  };
};
