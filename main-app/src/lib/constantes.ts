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

  // Videos
  "video/mp4",
  "video/quicktime",
];


// Facebook:
// Formatos Aceptados: Puedes subir imágenes en los siguientes formatos: JPG y PNG.
// Tamaño Recomendado: Para obtener mejores resultados, utiliza un archivo JPG o PNG.
// Relación de Aspecto: Consulta la guía de anuncios para ver las relaciones de aspecto recomendadas y sugerencias de diseño detalladas para cada ubicación12.
// Instagram:
// Formatos Aceptados: Instagram admite principalmente JPG y PNG.
// Tamaño Recomendado:
// Foto de Perfil: 400 x 400 píxeles.
// Imagen de Cabecera: 1500 x 500 píxeles o 1024 x 280 píxeles (máximo 5 MB).
// Twitter Cards o Vista Previa de Enlace: 800 x 418 píxeles o 800 x 800 píxeles (máximo 3 MB)12.
// Relación de Aspecto: 9:16 para imágenes en el timeline3.
// TikTok:
// Formatos Aceptados: TikTok admite JPEG, GIF y PNG.
// Tamaño Recomendado: Foto de perfil no inferior a 200 x 200 píxeles.
// Relación de Aspecto: 9:16 para videos4.
// YouTube:
// Formatos Aceptados: Puedes subir videos en los siguientes formatos: MOV, MPEG-1, MPEG-2, MPEG4, MP4, MPG, AVI, WMV, MPEGPS, FLV, 3GPP, WebM, DNxHR, ProRes, CineForm, HEVC (h265).
// Tamaño Recomendado: No hay un tamaño específico, pero sigue las recomendaciones de resolución y calidad5.
// Twitter:
// Formatos Aceptados: Twitter admite imágenes en formatos JPEG, GIF o PNG.
// Tamaño Máximo de Archivo para Imagen de Perfil: 2 MB.
// Tamaño Recomendado para Imagen de Cabecera: 1200 x 628 píxeles o mayor6.

// TIKTOK VALID FILE TYPES
// video/mp4
// video/quicktime
// video/webm

export const typesMultimedia = [
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
