"use client" // This is a client component

import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { ChevronDown, Mail } from "lucide-react";
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

  const { data: session, status } = useSession()


  const handlerLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handlerLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  };




  return (
    <div>
      <nav className="bg-gray-100 fixed w-full top-0 start-0 end-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* <img src={Logo.src} className="h-8" alt="Kibo Logo" /> */}
            <h1 className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">PublishWhere</h1>
          </Link>



          {/* MARCA SELECCIONADA */}
          <div className="">
            <Select    >
              <SelectTrigger className=" px-8">
                <SelectValue placeholder="Selecciona una marca" />
              </SelectTrigger>
              <SelectContent >
                {marcas.map((marca) => (
                  <SelectItem value={marca.id} key={marca.id}>{marca.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>



          {/* LOGIN BTN || UserProfile */}
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

            {session ? (


              <HoverCard
                openDelay={1}
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
      <br />
      <br />
      <br />
    </div >
  );
}
