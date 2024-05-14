"use client";
import React, { use, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { IMarca } from "shared-lib/models/marca.model";

import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import MarcaNueva from "./MarcaNueva";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { useSession } from "next-auth/react";
import { ShieldCheck } from "lucide-react";
import HoverAdmin from "../HoverAdmin";
import { IUser } from "shared-lib/models/user.model";

interface Props {
  hasNewBotton: boolean;
}

function MarcaSeleccionadaBuscador({ hasNewBotton }: Props) {
  // Aquí puedes usar las props para renderizar tu componente.
  // Este es solo un ejemplo básico, tendrás que adaptarlo a tus necesidades.

  const {
    marcas,
    isMarcaLoading,
    setIsOpenModalNuevaMarca,
    marcaGlobalSeleccionada,
    setMarcaGlobalSeleccionada,
  } = useContext(MisMarcasContext);

  const { data: session } = useSession();

  const [marcasFiltro, setMarcasFiltro] = React.useState<IMarca[]>(marcas);

  useEffect(() => {
    setMarcasFiltro(marcas);
  }, [marcas]);

  const onChangeInputHandler = (event: any) => {
    if (!event.target.value || event.target.value === "")
      return setMarcasFiltro(marcas);
    const nuevasMarcas = marcas.filter((marca) =>
      marca.name
        .toLowerCase()
        .includes(event.target.value.toString().toLowerCase())
    );
    setMarcasFiltro(nuevasMarcas);
  };

  return (
    // codigo original

    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Marcas</CardTitle>
        <CardDescription>Selecciona una marca</CardDescription>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            type="text"
            id="marca"
            placeholder="Marca ..."
            onChange={onChangeInputHandler}
          />
        </div>
      </CardHeader>

      <CardContent className="h-2/3 ">
        <ScrollArea className="h-full w-full">
          {isMarcaLoading ? (
            <p>Cargando...</p>
          ) : (
            marcasFiltro?.map((marca, index) => (
                <Button
                  variant={"ghost"}
                  key={marca._id}
                  className={` w-full ${
                    marca._id == marcaGlobalSeleccionada?._id
                      ? "bg-slate-200"
                      : ""
                  }`}
                  onClick={() => setMarcaGlobalSeleccionada(marca)}
                >
                  <div className="w-full flex justify-start items-center p-4 gap-3">
                    <span className="w-4">
                      {(marca.admin as IUser)._id === session?.user._id && (
                        <HoverAdmin/>
                      )}
                    </span>
                    <span>{marca.name}</span>
                  </div>
                </Button>
            ))
          )}
        </ScrollArea>
      </CardContent>

      <Separator className="my-2" />

      {hasNewBotton && (
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => setIsOpenModalNuevaMarca(true)}
          >
            Nueva marca
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default MarcaSeleccionadaBuscador;
