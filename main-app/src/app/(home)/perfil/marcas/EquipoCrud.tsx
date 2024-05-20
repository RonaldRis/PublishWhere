"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  deleteTeamMembersOnMarcaAction,
  fetchMarcaAction,
  renameMarcaAction,
} from "@/lib/actions/marcas.actions";
import { IUser } from "shared-lib/models/user.model";
import { CircleX, ShieldCheck } from "lucide-react";
import React, { useContext } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import MarcaNewTeamMember from "@/components/marcas/MarcaNewTeamMember";
import HoverAdmin from "@/components/HoverAdmin";

function EquipoCrud() {
  const {
    marcaGlobalSeleccionada,
    fetchRefreshMarcas,
    setMarcaGlobalSeleccionada,
    marcas,
  } = useContext(MisMarcasContext);
  const { data: session } = useSession();

  //Delete
  const [isOpenModalDelete, setIsOpenModalDelete] =
    React.useState<boolean>(false);
  const [userBorrar, setUserBorrar] = React.useState<IUser | null>(null);

  //New Team Member
  const [isOpenModalNewTeamMember, setIsOpenModalNewTeamMember] =
    React.useState<boolean>(false);

  function validacionesEliminarMiembro(user: IUser) {
    if (!user) {
      toast.info("No hay usuario seleccionado");
      return false;
    }

    
    if (!marcaGlobalSeleccionada) {
      toast.info("No hay marca seleccionada");
      return false;
    }

    if (user._id === (marcaGlobalSeleccionada?.admin as IUser)._id) {
      toast.info("No puedes eliminar al administrador");
      return false;
    }

    if((marcaGlobalSeleccionada?.admin as IUser)._id !== session?.user.id)
    {
      toast.info("Solo el administrador puede eliminar miembros");
      return false;
    }

    return true;
  }

  //Handlers
  //DELETE
  const handlerClickOnDeleteUserBadge = (user: IUser) => {
    if (!validacionesEliminarMiembro(user)) return;

    setUserBorrar(user);
    setIsOpenModalDelete(true);
  };

  const handlerAgregarMiembro = () => {
    if((marcaGlobalSeleccionada?.admin as IUser)._id !== session?.user.id)
    {
      toast.info("Solo el administrador puede agregar miembros");
      return;
    }
    setIsOpenModalNewTeamMember(true);
  };
  const handlerDeleteUseronMarca = async () => {
    //Validaciones
    if (!validacionesEliminarMiembro(userBorrar!)) return;

    const marcaId = marcaGlobalSeleccionada?._id;
    const result = await deleteTeamMembersOnMarcaAction(
      marcaId!,
      userBorrar?._id!
    );

    if (!result.isOk) {
      toast.error(result.message!);
      return;
    }
    toast.success("Usuario eliminado correctamente");

    setIsOpenModalDelete(false);
    setUserBorrar(null);

    ///Actualizo las marcas y la marca seleccionada
    await fetchRefreshMarcas();

    if (userBorrar?._id === session?.user.id) {
      setMarcaGlobalSeleccionada(null);
      return;
    }

    const marcaRenovada = await fetchMarcaAction(marcaGlobalSeleccionada?._id!);
    if (!marcaRenovada.isOk) {
      toast.error(marcaRenovada.message!);
      return;
    } else setMarcaGlobalSeleccionada(marcaRenovada.data);
  };

  return (
    <div>
      <h1 className="font-bold">Equipo</h1>
      <h1>Admin: {(marcaGlobalSeleccionada?.admin as IUser).name}</h1>

      <Separator className="my-2" />

      <h2 className="font-bold">Miembros</h2>

      {marcaGlobalSeleccionada &&
        marcaGlobalSeleccionada?.equipo?.length > 0 && (
          <ul className="list-disc list-inside">
            {marcaGlobalSeleccionada?.equipo?.map((user: any) => {
              const userMap = user as IUser;
              return (
                <li
                  key={userMap._id}
                  className="flex items-center justify-between"
                >
                  <div className="w-full flex justify-start items-center p-4 gap-3">
                    <span className="w-4">
                      {(marcaGlobalSeleccionada?.admin as IUser)._id === userMap._id && (
                        <HoverAdmin/>
                      )}
                    </span>
                    <span>{userMap.name} {userMap._id === session?.user._id && " (Tú) "}</span>
                  </div>
                  {(marcaGlobalSeleccionada?.admin as IUser)._id == session?.user.id && session?.user.id !== userMap._id  && (
                    <Button
                    className="justify-end"
                    variant="ghost"
                    onClick={() => handlerClickOnDeleteUserBadge(user)}
                  >
                    <CircleX color="#e00000" />
                  </Button>
                  )}

                  
                </li>
              );
            })}
          </ul>
        )}


      <Button
        className="w-full"
        variant="ghost"
        onClick={handlerAgregarMiembro}
      >
        Agregar miembro
      </Button>

      {marcaGlobalSeleccionada && (
        <>
          {/* Modal Agregar miembros nuevos al equipo */}
          <MarcaNewTeamMember
            isOpenModalNewTeamMember={isOpenModalNewTeamMember}
            setIsOpenModalNewTeamMember={setIsOpenModalNewTeamMember}
          />

          {/* // ConfirmarDelete Dialog */}
          <Dialog open={isOpenModalDelete} onOpenChange={setIsOpenModalDelete}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Eliminar usuario: <span>{userBorrar?.name + " " + (userBorrar?._id === session?.user._id ? " (Tú) " : "")}</span>
                </DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminarlo del equipo -{" "}
                  {marcaGlobalSeleccionada.name}?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handlerDeleteUseronMarca}
                >
                  Eliminar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default EquipoCrud;
