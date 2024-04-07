import React, { useState } from "react";
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
import { CircleX } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardContent } from "../ui/card";

interface IUploadFilesProps {
  isOpenModalNewFile: boolean;
  setIsOpenModalNewFile: React.Dispatch<React.SetStateAction<boolean>>;
}

const IndividualUploadFile = ({ file }: { file: File }) => {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center flex-col lg:flex-row">
          {/* IMAGE CARD */}
          <Card className=" p-4">
            {/* <Image
              src={URL.createObjectURL(file)}
              alt="Image"
              width={450}
              height={450}
              objectFit={"fit"}
            /> */}

            <div style={{ position: "relative",  width: "400px", height:"400px"}}>
              <Image
                src={URL.createObjectURL(file)}
                alt=""
                fill={true}
                style={{ objectFit: "contain" }}
              />
            </div>
          </Card>

          {/* FILE DATA */}

          <div className="container w-full ">
            <br />
            <p>Picture</p>
            <Input type="text" value={file.name} className="w-fill" />
            <p>{(file.size / (1024 * 1024)).toPrecision(2)} MB</p>
            <Button onClick={() => console.log("NOTHIUNG")}>NOTHING</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function UploadFiles({
  isOpenModalNewFile,
  setIsOpenModalNewFile,
}: IUploadFilesProps) {
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      let selectedFiles = Array.from(e.target.files);
      console.log(selectedFiles);
      setFiles(selectedFiles);
    }
  };

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
              onChange={handleFileInput}
              accept="image/*, video/*"
            />
          </label>

          {/* CONTENT - FILES */}
          {files.length > 0 && (
            <div className="flex flex-col gap-4 p-4 w-[80vw]">
              {files.map((file, index) => (
                <IndividualUploadFile key={index} file={file} />
              ))}
            </div>
          )}
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

export default UploadFiles;
