import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { CircleX, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardContent } from "../ui/card";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { IFilePost } from "shared-lib/models/file.model";
import { getSignedURL } from "@/lib/actions/s3.actions";
import { toast } from "sonner";
import { se } from "date-fns/locale";
import crypto from "crypto";
import axios from "axios";

import { postCreateFileAction } from "@/lib/actions/files.actions";
import { Progress } from "../ui/progress";
import { BibliotecaContext } from "@/contexts/BibliotecaContext";
import { bytesToSize } from "@/lib/utils";




export const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hash = crypto.createHash("sha256");
  hash.update(new Uint8Array(buffer));
  return hash.digest("hex");
};

const IndividualUploadFile = ({
  file,
  marcaId,
  userId,
  isUpdate = false,
}: {
  file: File;
  marcaId: string;
  userId: string;
  isUpdate?: boolean;
}) => {
  //CONTEXT
  const { fetchFilesContext } = useContext(BibliotecaContext);

  //LOCAL
  const [isUploading, setIsUploading] = useState(false);
  const [wasUploadingSuccessful, setWasUploadingSuccessful] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [nombre, setNombre] = useState<string>("");

  useEffect(() => {
    if (file) {
      setNombre(file.name);
    }
  }, [file]);

  const HandlerUploadFileAction = async ({
    fileName,
    file,
    marcaId,
    userId,
  }: {
    fileName: string;
    file: File;
    marcaId: string;
    userId: string;
  }) => {
    //Primero se obtiene el URL firmado
    setIsUploading(true);
    setUploadProgress(0);
    const extension = file.type.split("/")[1];
    const bucketFileName =
      marcaId + crypto.randomBytes(32).toString("hex") + "." + extension;

    try {
      var fileObject: IFilePost = {
        name: fileName,
        marcaId: marcaId,
        creatorId: userId,
        type: file.type.startsWith("image") ? "image" : "video",
        bucketFileName: bucketFileName,
        alreadyUsed: false,
        size: file.size,
      };

      const checksum = await computeSHA256(file);

      const fileData = {
        fileSize: file.size,
        fileType: file.type,
        checksum: checksum,
      };
      var resultSigningURL = await getSignedURL({
        newFile: fileObject,
        fileData: fileData,
      });

      if (!resultSigningURL.isOk) {
        toast.error(resultSigningURL.message);
        setIsUploading(false);
        return;
      }

      const signedUrl = resultSigningURL.data?.signedURL!;

      await axios.request({
        method: "PUT",
        url: signedUrl,
        data: file,
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="${fileObject.bucketFileName}"`,
        },

        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      // // tryout 2 subo el archivo firmado: //USA AXIOS PORQUE SI FALLA CAE EN EL CATCH
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": file.type, // set the content type header
          "Content-Disposition": `attachment; filename="${fileObject.bucketFileName}"`,
        },
      });

      ///Guardar el archivo en la base de datos
      const resultDb = await postCreateFileAction(fileObject);
      if (!resultDb.isOk) {
        toast.error(resultDb.message);
        setIsUploading(false);
        return;
      }

      if (resultDb.data) {
        //Necesito que esto altere el estado se muestre en el UI
      }

      //Actualizar la lista de archivos

      toast.success("Archivo subido correctamente");
      setWasUploadingSuccessful(true);
      fetchFilesContext();
    } catch (error) {
      toast.error("Error al subir el archivo : " + error);
      console.log(error);
    }

    setIsUploading(false);

    //Retornar el ID del archivo
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center flex-col lg:flex-row bg-slate-200">
          {/* IMAGE CARD */}
          <Card className=" p-4">
            <div
              style={{ position: "relative", width: "400px", height: "400px" }}
            >
              {file.type.startsWith("video") && (
                // <VideoIcon className="w-20 h-20" />
                //TODO: URGENTE: HACER QUE LOS VIDEOS SE VEAN EN EL CARD
                <video
                  style={{
                    position: "relative",
                    width: "400px",
                    height: "400px",
                  }}
                  src={URL.createObjectURL(file)}
                  controls
                ></video>
              )}

              {file.type.startsWith("image") && (
                <Image
                  src={URL.createObjectURL(file)}
                  alt=""
                  fill={true}
                  style={{ objectFit: "contain" }}
                />
              )}
            </div>
          </Card>

          {/* FILE DATA */}

          <div className="container w-full h-full  ">
            <br />
            <p>Nombre archivo:</p>
            <Input
              type="text"
              className="w-fill"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <p>{bytesToSize(file.size)}</p>
            <p>Tipo: {" " + file.type} </p>
            {/* TODO: ETIQUETAS ?? */}
            {wasUploadingSuccessful && (
              <p className="font-bold w-full m-auto p-auto">
                Archivo subido correctamente
              </p>
            )}
           

            {!wasUploadingSuccessful && (
              <Button
                className="w-full"
                onClick={async () => {
                  await HandlerUploadFileAction({
                    fileName: nombre,
                    file: file,
                    marcaId: marcaId,
                    userId: userId,
                  });
                }}
                disabled={isUploading}
              >
                {isUpdate ? "Actualizar" : "Subir"}
              </Button>

            )}
            {isUploading && (
              <div className="flex flex-col gap-8 w-full items-center mt-24">
                <Progress value={uploadProgress} />
                <div className="text-2xl">Subiendo archivo...</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface IUploadFilesProps {
  isOpenModalNewFile: boolean;
  setIsOpenModalNewFile: React.Dispatch<React.SetStateAction<boolean>>;
}

function UploadFiles({
  isOpenModalNewFile,
  setIsOpenModalNewFile,
}: IUploadFilesProps) {
  const { data: session } = useSession();
  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);
  const [files, setFiles] = useState<File[]>([]);
  const [fileUploadLauncher, setFileUploadLauncher] = useState<void[]>([]);

  const handleFileInputOnChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target?.files) {
      let selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  //DRAG AND DROP
  const onDrop = useCallback((event: any) => {
    event.preventDefault();

    if (event.dataTransfer.files) {
      let selectedFiles = Array.from(event.dataTransfer.files) as File[];
      setFiles(selectedFiles);
    }
  }, []);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
  }, []);

  const handlerUploadAll = async () => { };

  return (
    <AlertDialog onOpenChange={setIsOpenModalNewFile} open={isOpenModalNewFile}>
      <AlertDialogContent
        className="flex flex-col justify-between over-nav 
        h-[95vh]
      sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl 
       overflow-y-scroll "
      >
        {/* HEADER */}
        <AlertDialogHeader className="flex">
          <AlertDialogTitle>Subir archivos multimedia</AlertDialogTitle>
          <AlertDialogDescription>
            Solo puede subir archivos de video y/o imagen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          variant={"ghost"}
          className="absolute top-6 right-6 "
          onClick={() => setIsOpenModalNewFile(false)}
        >
          <CircleX size={32} />
        </Button>

        {/* CONTENT */}

        <div className="flex flex-col items-center justify-center w-full">
          {/* CONTENT - INPUT */}
          <label
            htmlFor="dropzone-file"
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              multiple={true}
              onChange={handleFileInputOnChangeEvent}
              accept="image/*, video/*"
            />
          </label>

          {/* CONTENT - FILES */}
          {files.length > 0 && (
            <div className="flex flex-col gap-4 p-4 w-[80vw]">
              {files.map((file, index) => (
                <IndividualUploadFile
                  key={index}
                  file={file}
                  marcaId={marcaGlobalSeleccionada?._id!}
                  userId={session?.user._id!}
                />
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <AlertDialogFooter className="bottom-0">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction onClick={handlerUploadAll}>
            Subir todos
          </AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UploadFiles;
