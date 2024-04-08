"use client" // This is a client component

import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ChevronDown, CircleFadingPlus, CirclePlus, ImageUp, Mail } from "lucide-react";
import Image from "next/image";
import { perfilProfile } from "@/assets";
import { useContext } from "react";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";



export default function BasicHeader() {


  const { setMarcaGlobalSeleccionada } = useContext(MisMarcasContext);

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


  return (
    <nav className="fixed h-20 w-full top-0 start-0 bg-slate-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">


        <Button className="m-0 w-full" variant={"ghost"}>Hola</Button>
        <p className="text-slate-500">Hola</p>

        <div>
          <p className="text-slate-500">Hola</p>
          <p className="text-slate-100">Administra tus marcas en un solo lugar</p>
        </div>




        {/* BOTON DE + && (BOTON DE LOGIN O DEL USUARIO)  */}
        <div className="flex gap-4 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">


          {/* BOTON DE AGREAR UN NUEVO POST, MARCA, RED SOCIAL */}
          {session && (
            <Link href="/dashboard">
              <Button className="m-0 w-full" >Abrir app</Button>
            </Link>

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

    </nav>
  );
}
