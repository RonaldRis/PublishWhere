import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";

import { FileTextIcon, GanttChartIcon, ImageIcon, SquarePlay, VideoIcon } from "lucide-react";
import { ReactNode } from "react";
import Image from "next/image";
import { FileCardActions, getFileUrl } from "./file-actions";
import { IFile } from "@/lib/models/file.model";
import { IUser } from "@/lib/models/user.model";
import { FileType } from "./file-browser";
import { z } from "zod";

export function FileCard({
  file,
}: {
  file: IFile & { isFavorited: boolean };
}) {
  const userProfile = (file.creatorId as IUser)

  const typeIcons = {
    image: <ImageIcon />,
    video: <SquarePlay />
  } as Record< string, ReactNode>;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex justify-start gap-2 text-base font-normal ">
          <div className="flex justify-center ">{typeIcons[file.type]}</div>{" "}
          <span className="w-auto whitespace-break-spaces">
            {file.name}
            {file.name}
            {file.name}
            </span>
        </CardTitle>
        <div className="absolute top-2 right-2">
          <FileCardActions isFavorited={file.isFavorited} file={file} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && (
          <Image
            alt={file.name}
            width="200"
            height="100"
            src={file.url} //TODO: Cambiar por la url de la imagen
          />
        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
        {file.type === "video" && (
          // <VideoIcon className="w-20 h-20" />
          <video
            className="h-20 w-20"
            src={file.url}
            controls
            autoPlay

          ></video>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded on {formatRelative(new Date(file.createdAt), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
