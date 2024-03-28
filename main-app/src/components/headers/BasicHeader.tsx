"use client" // This is a client component

import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ChevronDown, CircleFadingPlus, CirclePlus, ImageUp, Mail } from "lucide-react";
import Image from "next/image";
import { perfilProfile } from "@/assets";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Session } from "next-auth";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import { useContext } from "react";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";

interface marcas {
  id: string,
  name: string,
}

const marcas: marcas[] = [
  { id: "1", name: "Marcela Peraz" },
  { id: "2", name: "Ucam" },
  { id: "3", name: "Ronald Ris" },
  // Add more brands as needed
];

export default function BasicHeader() {


  const { marcas, isMarcaLoading, setMarcaGlobalSeleccionada, marcaGlobalSeleccionada } = useContext(MisMarcasContext);

  const { data: session, status } = useSession()



  const handlerLogout = (e: any) => {
    e.preventDefault();
    setMarcaGlobalSeleccionada(null);


    signOut({ callbackUrl: "/" });
  };

  const handlerLogin = (e: any) => {
    e.preventDefault();
    setMarcaGlobalSeleccionada(null);

    signIn("google", { callbackUrl: "/dashboard" })
  };

  const handlerMarcaSelectedChanged = (idSelected: string) => {
    if (!idSelected) return;
    const marcaSelected = marcas.find(marca => marca._id === idSelected)
    setMarcaGlobalSeleccionada(marcaSelected || null);
  }




  return (
    <nav className="fixed h-20 w-full top-0 start-0  bg-slate-900 ">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* <img src={Logo.src} className="h-8" alt="Kibo Logo" /> */}
          <h1 className="self-center text-2xl font-semibold whitespace-nowrap text-slate-100">PublishWhere</h1>
        </Link>



        {/* SELECTOR DE MARCAS */}
        {session &&
          <div>
            {
              isMarcaLoading ?
                <p className="text-slate-100">Cargando...</p>
                :
                (
                  // <p className="text-slate-100">Hay datos</p>
                  marcas?.length <= 0 ? (
                    <p className="text-slate-100">Crea una marca</p>
                  ) : (
                    <Select onValueChange={handlerMarcaSelectedChanged}
                      value={
                        marcaGlobalSeleccionada
                          ? marcaGlobalSeleccionada?._id
                          : undefined
                      }>
                      <SelectTrigger className=" px-8">
                        <SelectValue placeholder="Selecciona una marca" />
                      </SelectTrigger>
                      <SelectContent >

                        {marcas?.map((marca) => (
                          <SelectItem className="gap-5" value={marca._id} key={marca._id}>
                            {marca.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )
                )
            }

          </div>
        }



        {/* BOTON DE + && (BOTON DE LOGIN O DEL USUARIO)  */}
        <div className="flex gap-4 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">


          {/* BOTON DE AGREAR UN NUEVO POST, MARCA, RED SOCIAL */}
          {session && (
            <HoverCard
              openDelay={1}
              closeDelay={5}
            >
              <HoverCardTrigger href="/perfil/mis-datos">
                <CircleFadingPlus className="m-4 p-0" size={24} color="#ffffff" absoluteStrokeWidth />
              </HoverCardTrigger>
              <HoverCardContent className="m-0 p-0" >
                <div>
                  <Button className="m-0 w-full gap-1 " variant={"ghost"}>
                    <CircleFadingPlus size={16} absoluteStrokeWidth />
                    Publicación
                  </Button>
                  <Button className="m-0 w-full gap-1" variant={"ghost"}>
                    <CircleFadingPlus size={16} absoluteStrokeWidth />
                    marca
                  </Button>
                  <Button className="m-0 w-full gap-1" variant={"ghost"}>
                    <CircleFadingPlus size={16} absoluteStrokeWidth />
                    Red social
                  </Button>
                  <Button className="m-0 w-full gap-1" variant={"ghost"}>
                    <ImageUp size={16} absoluteStrokeWidth />
                    Multimedia
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>


          )}

          {/* LOGIN BTN || UserProfile */}
          {session ? (
            <HoverCard
              openDelay={1}
              closeDelay={5}

            >
              <HoverCardTrigger href="/perfil/mis-datos">
                {session?.user?.image ?
                  <Image src={session.user.image} alt="Foto de perfil" className="rounded-full w-10 h-10 object-cover" width={40} height={40} />
                  :
                  <Image src={perfilProfile} alt="Foto de perfil" className="rounded-full w-10 h-10 object-cover" />
                }
              </HoverCardTrigger>
              <HoverCardContent className="m-0 p-0" >
                <div>
                  <p className="m-0 w-full text-center font-medium">{session.user.name}</p>
                  <Link href="/perfil/mis-datos">
                    <Button className="m-0 w-full" variant={"ghost"}>Mis datos</Button>
                  </Link>
                  <Link href="/perfil/marcas">
                    <Button className="m-0 w-full" variant={"ghost"}>Mis marcas</Button>
                  </Link>

                  <Button className="m-0 w-full" variant={"ghost"} onClick={handlerLogout}>Cerrar sesión</Button>
                </div>
              </HoverCardContent>
            </HoverCard>





          ) : (
            <Button
              onClick={handlerLogin} >
              <Mail className="mr-2 h-4 w-4" /> Login
            </Button>

          )}


        </div>
      </div>
    </nav >
  );
}
