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
  ImageIcon,
  SquareMousePointer,
  SquarePlay,
} from "lucide-react";
import { ReactNode, useContext, useState } from "react";
import Image from "next/image";
import { FileCardActions } from "./file-card-actions";
import { IFile, IFileFavorite } from "shared-lib/models/file.model";
import { IUser } from "shared-lib/models/user.model";
import { es, se } from "date-fns/locale";
import { getMediaUrl } from "@/lib/constantes";
import FullScreenMultimediaFileDialog from "../../calendario/_components/FullScreenMultimediaFileDialog";
import { CalendarioContext } from "@contexts/CalendarioContext";

export function FileCard({ file }: { file: IFileFavorite }) {
  const userProfile = file.creatorId as IUser;

  const [isOpenModalBigFile, setIsOpenModalBigFile] = useState(false);

  const { selectedFileList, setSelectedFileList, isCalendarPage } = useContext(CalendarioContext);



  const handlerDoubleClick = () => {
    if (!isCalendarPage)
      setIsOpenModalBigFile(true);
  }


  const handlerOneClick = () => {
    
    const contains = selectedFileList.some((f) => f._id === file._id);
    if (contains) {
      const filtered = selectedFileList.filter((f) => f._id !== file._id);
      setSelectedFileList(filtered);
      return;
    }
    setSelectedFileList([...selectedFileList, file]);
  }




  const typeIcons = {
    image: <ImageIcon />,
    video: <SquarePlay />,
  } as Record<string, ReactNode>;

  return (
    <Card className={" flex flex-col justify-between " + (selectedFileList.some(f => f._id == file._id) ? "bg-blue-300" : "")}
      onClick={handlerOneClick}
      onDoubleClick={handlerDoubleClick}>
      <CardHeader className=" relative mb-4">

        <CardTitle className="flex justify-start gap-2 text-base font-normal w-[200px]" >
          <div className="flex justify-center " >
            {typeIcons[file.type]}
          </div>
          {" "}
          {/* TODO: QUE SE VEA BIEN EL TEXTO SI ES MUY LARGO */}
          <span className="w-full text-ellipsis overflow-hidden">{file.name}</span>

        </CardTitle>
        <div className="absolute top-2 right-2">
          <div>

            <FileCardActions isFavorited={file.isFavorited} file={file} />
            {selectedFileList.some(f => f._id == file._id) && <SquareMousePointer />}
          </div>

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
