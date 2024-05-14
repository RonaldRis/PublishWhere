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

interface INewPublicacionProps {
  isOpenModalNewPost: boolean;
  setIsOpenModalNewPost: React.Dispatch<React.SetStateAction<boolean>>;
}

function NewPublicacion({
  isOpenModalNewPost,
  setIsOpenModalNewPost,
}: INewPublicacionProps) {
  const { data: session } = useSession();
  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);
  const [files, setFiles] = useState<File[]>([]);

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

  return (
    <AlertDialog onOpenChange={setIsOpenModalNewPost} open={isOpenModalNewPost}>
      <AlertDialogContent
        className="flex flex-col justify-between over-nav 
            h-[95vh]
          sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl 
           overflow-y-scroll "
      >
        {/* HEADER */}
        <AlertDialogHeader className="flex">
          <AlertDialogTitle>Crear nueva publicación</AlertDialogTitle>
          <AlertDialogDescription>
            Prepara tu publicacion para multiples redes sociales
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Button
          variant={"ghost"}
          className="absolute top-6 right-6 "
          onClick={() => setIsOpenModalNewPost(false)}
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
        </div>

        {/* FOOTER */}
        <AlertDialogFooter className="bottom-0">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default NewPublicacion;