import {
  CheckCheck,
  Circle,
  CircleX,
  FileQuestion,
  Image,
  Timer,
  VideoIcon,
} from "lucide-react";


export function getMediaUrl(bucketKey: string) {
  return "https://publishwhere-tfg.s3.eu-west-3.amazonaws.com/" + bucketKey;
}

//TODO: revisar si estos archivos son validos para redes sociales
export const allowedFileTypes = [
  // Imágenes
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/svg+xml",

  // Videos
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo", // AVI
  "video/x-ms-wmv", // WMV
  "video/mpeg", // MPEG
  "video/3gpp", // 3GP
  "video/3gpp2", // 3G2
  "video/ogg", // OGG
  "video/webm", // WEBM
  "video/x-matroska", // MKV
];

export const types = [
  {
    value: "image",
    label: "Imagenes",
    icon: Image,
  },
  {
    value: "video",
    label: "Videos",
    icon: VideoIcon,
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: FileQuestion,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCheck,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleX,
  },
];