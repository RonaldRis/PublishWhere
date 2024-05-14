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
import { CircleX, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IFile } from "shared-lib/models/file.model";
import Image from "next/image";
import { getMediaUrl } from "@/lib/constantes";
import { toast } from "sonner";


interface IFullScreenFileProps {
  isOpenModalBigFile: boolean;
  setIsOpenModalBigFile: React.Dispatch<React.SetStateAction<boolean>>;
  file: IFile & { isFavorited: boolean };
}

function FullScreenMultimediaFileDialog({
  isOpenModalBigFile,
  setIsOpenModalBigFile,
  file,
}: IFullScreenFileProps) {
  const [nombre, setNombre] = useState(file.name);

  const handlerSaveFileChanges = async () => {
    // TODO: UPDATE FILE DATA
    console.log("guardar cambios");
    toast.info("FALTA POR HACER");
  };

  return (
    <AlertDialog onOpenChange={setIsOpenModalBigFile} open={isOpenModalBigFile}>
      <AlertDialogContent
        className="flex flex-col justify-between over-nav 
        h-[95vh]
      sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl 
       overflow-y-scroll "
      >
        {/* HEADER */}
        <AlertDialogHeader className="flex">
          <AlertDialogTitle>Visualización del archivo</AlertDialogTitle>
          <AlertDialogDescription>{file.name} </AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          variant={"ghost"}
          className="absolute top-6 right-6 "
          onClick={() => setIsOpenModalBigFile(false)}
        >
          <CircleX size={32} />
        </Button>

        {/* CONTENT */}

        <div className="flex flex-col items-center justify-center w-full">
          {/* CONTENT - FILE */}
          <div className=" flex items-center  container w-full bg-slate-200 ">
            <div className="w-full">
              <br />
              <p>Nombre archivo:</p>

              <Input
                type="text"
                className="w-fill"
                value={nombre}
                onChange={(e: any) => setNombre(e.target.value)}
              />
              {/* <p>{(file.size / (1024 * 1024)).toPrecision(2)} MB</p> */}
              {/* TODO: FILE AGREGAR TAMAÑA EN BYTES */}
              <p>ETIQUETAS?? </p>
              {/* TODO: PONER ETIQUETAS */}
              <p>Type: {" " + file.type} </p>
            </div>
            <AlertDialogAction onClick={handlerSaveFileChanges}>
              Guardar cambios
            </AlertDialogAction>
          </div>
          {/* IMAGE - VIDEO */}
          {file.type === "image" && (
            <div
              style={{ position: "relative", width: "800px", height: "800px" }}
            >
              <Image
                src={getMediaUrl(file.bucketFileName)}
                alt={file.name}
                fill={true}
                style={{ objectFit: "contain" }}
              />
            </div>
          )}

          {file.type === "video" && (
            // <VideoIcon className="w-20 h-20" />
            //TODO: URGENTE: HACER QUE LOS VIDEOS SE VEAN EN EL CARD
            <video
              className="h-20 w-20"
              src={getMediaUrl(file.bucketFileName)}
              controls
              autoPlay
            ></video>
          )}
        </div>

        {/* FOOTER */}
        <AlertDialogFooter className="bottom-0">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default FullScreenMultimediaFileDialog;
