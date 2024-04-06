import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useContext, useState } from "react";
import {
  restoreTrashFileAction,
  sendToTrashFileAction,
} from "@/lib/actions/files.actions";
import { IFile } from "@/lib/models/file.model";
import { toast } from "sonner";
import { BibliotecaContext } from "@/contexts/BibliotecaContext";

export function FileCardActions({
  file,
  isFavorited,
}: {
  file: IFile;
  isFavorited: boolean;
}) {
  const { handlerRestoreFile, handlerTrashFile } =
    useContext(BibliotecaContext);

  // const toggleFavorite = useMutation(api.files.toggleFavorite); ///TODO: REVISAR como hacer los favoritos, si por archivo o por usuario o marca

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  // TODO: Terminar cambiando por Dialog, no hay necesidad de que sean AlertDialog y no se puedan cerrar solos...
  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás totalmente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción marcará el archivo para nuestro proceso de eliminación.
              Los archivos son eliminados periódicamente
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handlerTrashFile(file._id);

               
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open(file.name, "_blank"); //TODO: REVISAR DOWNLOAD
              // window.open(getFileUrl(file._id), "_blank"); //TODO: REVISAR DOWNLOAD
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <FileIcon className="w-4 h-4" /> Download
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              toast.error("Not implemented yet");
              // toggleFavorite({
              //   fileId: file._id,
              // });
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {isFavorited ? (
              <div className="flex gap-1 items-center">
                <StarIcon className="w-4 h-4" /> Unfavorite
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <StarHalf className="w-4 h-4" /> Favorite
              </div>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              if (file.shouldDelete) {
                handlerRestoreFile(file._id);
                //TODO: REMOVER DE LOS ARCHIVOS EL BORRADO
              } else {
                setIsConfirmOpen(true);
              }
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {file.shouldDelete ? (
              <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                <UndoIcon className="w-4 h-4" /> Restore
              </div>
            ) : (
              <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                <TrashIcon className="w-4 h-4" /> Delete
              </div>
            )}
          </DropdownMenuItem>

          {/* TODO: VALIDAR PROTECCION DEL DELETE PARA USARLO SOLAMENTE EL ADMIN O BIEN SOLO BORRAR ARCHIVOS PROPIOS */}
          {/* <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={<></>}
          >
            //aca deberia ir el boton de borrar si hago las validaciones luego
          </Protect> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

//TODO: Modificar segun el URL del bucket y el nombre del archivo!
export function getFileUrl(fileId: string): string {
  return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
}
