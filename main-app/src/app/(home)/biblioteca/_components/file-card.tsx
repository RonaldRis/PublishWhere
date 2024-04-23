import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";

import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  SquarePlay,
  VideoIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import Image from "next/image";
import { FileCardActions } from "./file-card-actions";
import { IFile } from "@/lib/models/file.model";
import { IUser } from "@/lib/models/user.model";
import { z } from "zod";
import { es } from "date-fns/locale";
import { getMediaUrl } from "@/lib/constantes";
import { set } from "mongoose";
import FullScreenMultimediaFileDialog from "../../calendario/_components/FullScreenMultimediaFileDialog";

export function FileCard({ file }: { file: IFile & { isFavorited: boolean } }) {
  const userProfile = file.creatorId as IUser;

  const [isOpenModalBigFile, setIsOpenModalBigFile] = useState(false);
  
  const handlerDoubleClick = () => {
    console.log("doble click", file.bucketFileName);
    setIsOpenModalBigFile(true);
  }




  const typeIcons = {
    image: <ImageIcon />,
    video: <SquarePlay />,
  } as Record<string, ReactNode>;

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className=" relative mb-4">
        <CardTitle className="flex justify-start gap-2 text-base font-normal w-[200px]">
          <div className="flex justify-center ">{typeIcons[file.type]}</div>{" "}
          {/* TODO: QUE SE VEA BIEN EL TEXTO SI ES MUY LARGO */}
          <span className="w-full text-ellipsis overflow-hidden">{file.name}</span>

        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && (
          <div
            style={{ position: "relative", width: "200px", height: "200px" }}
          >
            <Image
              src={getMediaUrl(file.bucketFileName)}
              alt={file.name}
              fill={true}
              style={{ objectFit: "contain" }}
              onDoubleClick={handlerDoubleClick}
            />
          </div>
        )}

        {file.type === "video" && (
          // <VideoIcon className="w-20 h-20" />
          //TODO: URGENTE: HACER QUE LOS VIDEOS SE VEAN EN EL CARD
          <video
          style={{ position: "relative", width: "200px", height: "200px" }}
            src={getMediaUrl(file.bucketFileName)}
            controls
          ></video>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center mt-4">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700 mt-4">
          <div className="border-l border-slate-900 h-auto mx-2 px-4">
            Subido:{" "}
            {formatRelative(new Date(file.createdAt), new Date(), {
              locale: es,
            })}
          </div>
        </div>
      </CardFooter>
      <FullScreenMultimediaFileDialog file={file} isOpenModalBigFile={isOpenModalBigFile} setIsOpenModalBigFile={setIsOpenModalBigFile} />
    </Card>
  );
}
