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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import {
  restoreTrashFileAction,
  sendToTrashFileAction,
} from "@/lib/actions/files.actions";
import { IFile } from "@/lib/models/file.model";
import { toast } from "sonner";
import { BibliotecaContext } from "@/contexts/BibliotecaContext";
import { Button } from "@/components/ui/button";
import { getMediaUrl } from "@/lib/constantes";

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
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás totalmente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción marcará el archivo para nuestro proceso de
              eliminación. Los archivos son eliminados periódicamente
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsConfirmOpen(false)}>Cancelar</Button>
            <Button variant={"destructive"}
              onClick={async () => {
                await handlerTrashFile(file._id);
              }}
            >
              Borrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open(getMediaUrl(file.bucketFileName), "_blank");
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

