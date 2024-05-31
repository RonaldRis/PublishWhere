"use client";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import React, { useContext } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CircleX, DeleteIcon, Pencil } from "lucide-react";
import {
  deleteMarcaAction,
  deleteTeamMembersOnMarcaAction,
  fetchMarcaAction,
  renameMarcaAction,
} from "@/lib/actions/marcas.actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import EquipoCrud from "./EquipoCrud";
import Link from "next/link";
import NuevaRedSocial from "./NuevaRedSocial";
import { ISocialMediaAccount } from "shared-lib/models/socialMediaAccount.model";
import { map } from "zod";
import { labelsProviderToColor } from "@/lib/constantes";
import Image from "next/image";
import { deleteRedSocialAction } from "@/lib/actions/socialMediaAccount.actions";

function RedSocialCardItem({ social }: { social: ISocialMediaAccount }) {

  const color = labelsProviderToColor[social.provider];

  //Session
  const { data: session } = useSession();
  //Marca
  const { marcaGlobalSeleccionada, updateMarcaGlobal } = useContext(MisMarcasContext);

  const [isOpenModalDeleteRedSocial, setIsOpenModalDeleteRedSocial] = React.useState<boolean>(false);


  const handlerDeleteMarcaClick = async () => {

    // console.log("marcaGlobalSeleccionada",marcaGlobalSeleccionada);
    // console.log("session?.user?.id",session?.user?.id);

    if (!marcaGlobalSeleccionada) {
      toast.error("No hay marca seleccionada");
      setIsOpenModalDeleteRedSocial(false);
      return;
    }


    const result = await deleteRedSocialAction(marcaGlobalSeleccionada!._id, social._id, session?.user?.id!);
    // console.log("result deleteRedSocialAction", result);
    if (!result.isOk) {
      toast.error(result.message!);
      setIsOpenModalDeleteRedSocial(false);
      return;
    }

    toast.success(result.message!);

    setIsOpenModalDeleteRedSocial(false);

    //Tengo que actualizar el UI
    await updateMarcaGlobal(marcaGlobalSeleccionada._id);
  };

  return (
    <Card className={`w-40 h-full border-4 border-${color}-500`}>
      <CardContent className="flex flex-col justify-between items-center p-3 h-full">
        <Link className="flex flex-col justify-between items-center" href={social.urlPage ?? "#"} target="_blank">
          <Image
            src={social.thumbnail}
            width={50}
            height={50}
            className="rounded-full"
            alt="Description of the image"
            style={{ objectFit: "contain" }}
          />

          <p className="text-center font-bold m-0 text-xl pb-2">
            {social.name}
          </p>
        </Link>
        <div className="relative w-full">
          <p className="text-center mx-6">{social.provider}</p>

          {marcaGlobalSeleccionada && (
            <>
              {/* // Cambiar Nombre Dialog */}
              <Dialog open={isOpenModalDeleteRedSocial} onOpenChange={setIsOpenModalDeleteRedSocial}>
                <DialogTrigger asChild>
                  <DeleteIcon
                    className="absolute right-2 top-0 cursor-pointer"
                  // onClick={handlerDeleteMarcaClick}
                  />
                </DialogTrigger>
                <DialogContent className="sm:min-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>
                      Eliminar red social: {social.name + " - " + social.provider}
                    </DialogTitle>
                    <DialogDescription>
                      <div>
                        <br />
                        <p>Se eliminarán todas las publicaciones que han sido hechas con esta red social. Si hay publicaciones programadas tamnbién se eliminarán y no serán publicadas</p>
                        <br />
                        <p>Si otra marca tiene esta red social, esa marca seguirá teniendo la red social y sus publicaciones</p>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="default"
                      onClick={handlerDeleteMarcaClick}
                    >
                      Confirmar eliminar red social
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>



      </CardContent>
    </Card>
  );
}

function DetallesMarcaEditable() {
  const {
    marcaGlobalSeleccionada,
    fetchRefreshMarcas,
    setMarcaGlobalSeleccionada,
    marcas,
  } = useContext(MisMarcasContext);

  //Rename
  const [isOpenModalRename, setIsOpenModalRename] =
    React.useState<boolean>(false);
  const [newName, setNewName] = React.useState<string>("");

  //RENAME
  const handlerClickOnRenameOpenModal = () => {
    setIsOpenModalRename(true);
  };

  const handlerRenameMarcaConfirmarNuevoNombre = async () => {
    //Validaciones
    if (!marcaGlobalSeleccionada) {
      toast.info("No hay marca seleccionada");
      return;
    }

    if (newName === "") {
      toast.info("No hay nombre nuevo");
      return;
    }

    const marcaId = marcaGlobalSeleccionada._id;
    const result = await renameMarcaAction(marcaId, newName);
    if (!result.isOk) {
      toast.error(result.message!);
      return;
    }

    await fetchRefreshMarcas();
    setMarcaGlobalSeleccionada({
      ...marcaGlobalSeleccionada,
      name: newName,
    });

    toast.success("Marca renombrada correctamente");
    setIsOpenModalRename(false);
    setNewName("");
  };


  return (
    <div className="flex-grow">
      {!marcaGlobalSeleccionada ? (
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="text-center">Selecciona una marca</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <Card className="w-full h-full flex flex-col">
          <CardHeader>
            <CardTitle className="text-center flex">
              <span className="flex-grow flex justify-center">
                {marcaGlobalSeleccionada?.name}
              </span>
              <Button
                variant={"ghost"}
                className="relative right-0"
                onClick={handlerClickOnRenameOpenModal}
              >
                <Pencil />
              </Button>
            </CardTitle>
            <CardDescription>Detalles de la marca</CardDescription>
          </CardHeader>

          <ScrollArea className="h-full w-full">
            <CardContent className="flex-grow">
              <Tabs defaultValue="redes" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger className="w-full" value="redes">
                    Redes sociales
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="equipo">
                    Equipo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="redes">
                  <h1 className="font-bold">Redes sociales</h1>

                  {marcaGlobalSeleccionada?.socialMedia.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 grid-flow-row justify-items-center justify-center">

                      {/* <div className="flex items-center gap-4 flex-wrap justify-evenly"> */}
                      {marcaGlobalSeleccionada.socialMedia.map((social) => (
                        <RedSocialCardItem key={social._id} social={social} />
                      ))}
                    </div>
                  )}

                  {marcaGlobalSeleccionada?.socialMedia.length === 0 && (
                    <p>No hay redes sociales</p>
                  )}


                  <NuevaRedSocial />
                </TabsContent>
                <TabsContent value="equipo">
                  <EquipoCrud />
                </TabsContent>
              </Tabs>
            </CardContent>
          </ScrollArea>
        </Card>
      )}
      {marcaGlobalSeleccionada && (
        <>
          {/* // Cambiar Nombre Dialog */}
          <Dialog open={isOpenModalRename} onOpenChange={setIsOpenModalRename}>
            <DialogTrigger asChild>
              <Button className=" hidden w-full">Cambiar nombre</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  Cambiar nombre: {marcaGlobalSeleccionada.name}
                </DialogTitle>
                <DialogDescription>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <span className="text-right">Nuevo nombre</span>
                      <Input
                        id="marca"
                        placeholder="Marca"
                        className="col-span-3"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="default"
                  onClick={handlerRenameMarcaConfirmarNuevoNombre}
                >
                  Confirmar nuevo nombre
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default DetallesMarcaEditable;
