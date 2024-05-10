"use client";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ISocialMediaAccount } from "@lib/models/socialMediaAccount.model";
import { map } from "zod";
import { labelsProviderToColor } from "@lib/constantes";

function RedSocialCardItem({ social }: { social: ISocialMediaAccount }) {
  const xd = [1, 1, 1, 1, 1, 1, 1, 1];

  console.log(social);

  const color = labelsProviderToColor[social.provider];

  const handlerDeleteMarcaClick = async () => {
    toast.info("No implementado aún");
    //TODO: delete marca // Only admin

    // const result = await deleteMarcaAction(social._id);
    // if (!result.isOk) {
    //   toast.error(result.message!);
    //   return;
    // }

    // toast.success("Red social eliminada correctamente");
  };

  return (
    <div>
      <Card className={`w-auto h-auto bg-${color}-500`}>
        <CardContent className="flex flex-col items-center p-3">
          <Link href={social.urlPage!} target="_blank">
            <p className="text-center font-bold m-0 text-xl pb-2">
              {social.name}
            </p>
          </Link>
        </CardContent>
      </Card>
      <div className="relative">
        <p className="text-center">{social.provider}</p>
        <DeleteIcon
          className="absolute right-0 top-0 cursor-pointer"
          onClick={handlerDeleteMarcaClick}
        />
      </div>
    </div>
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

  console.log("DetallesMarcaEditable", marcaGlobalSeleccionada);

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
                    <div className="flex items-center gap-4 flex-wrap justify-evenly">
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
