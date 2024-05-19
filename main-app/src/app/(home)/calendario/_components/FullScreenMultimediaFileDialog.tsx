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
import { putFileRenameAction } from "@/lib/actions/files.actions";
import { BibliotecaContext } from "@/contexts/BibliotecaContext";


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
  const { fetchFilesContext } = useContext(BibliotecaContext);

  const handlerSaveFileChanges = async () => {


    const result = await putFileRenameAction(file._id, nombre);
    if (!result.isOk) {
      toast.error("Error al guardar los cambios");
      return;
    }

    await fetchFilesContext();

    toast.success("Cambios guardados correctamente");


  };

  return (
    <AlertDialog onOpenChange={setIsOpenModalBigFile} open={isOpenModalBigFile}>
      <AlertDialogContent
        className="flex flex-col over-nav 
        h-[95vh]
      sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl 
       overflow-y-scroll "
      >
        {/* HEADER */}
        <AlertDialogHeader className="flex">
          <AlertDialogTitle>Visualización del {file.type}</AlertDialogTitle>
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

        <div className="flex flex-col items-center justify-center w-full ">
          {/* CONTENT - FILE */}
          <div className=" flex items-center justify-center  container w-full bg-slate-100 my-8">
            <div className="w-full">
              <br />
              <p>Nombre archivo:</p>

              <div className="flex">

                <Input
                  type="text"
                  className="w-fill"
                  value={nombre}
                  onChange={(e: any) => setNombre(e.target.value)}
                />

                <Button onClick={handlerSaveFileChanges} className="place-self-center">
                  Guardar cambios
                </Button>
              </div>
              {/* <p>{(file.size / (1024 * 1024)).toPrecision(2)} MB</p> */}
              {/* TODO: FILE AGREGAR TAMAÑA EN BYTES */}
              {/* TODO: PONER ETIQUETAS */}
            </div>

          </div>
          {/* IMAGE - VIDEO */}
          <div
            className="w-full flex items-center justify-center px-8"
          >

            {file.type === "image" && (


              <img src={getMediaUrl(file.bucketFileName)} alt={file.name} className="h-full w-full object-contain" />

              // <Image
              // src={getMediaUrl(file.bucketFileName)}
              // alt={file.name}
              // objectFit="cover"
              // layout="fill"

              // className="h-full w-full object-contain"
              // />
            )}

            {file.type === "video" && (
              // <VideoIcon className="w-20 h-20" />
              //TODO: URGENTE: HACER QUE LOS VIDEOS SE VEAN EN EL CARD
              <video
                className="h-full w-full"
                src={getMediaUrl(file.bucketFileName)}
                controls
              ></video>
            )}
          </div>


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
