"use client"; // This is a client component

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  ChevronDown,
  CircleFadingPlus,
  CirclePlus,
  ImageUp,
  Mail,
} from "lucide-react";
import Image from "next/image";
import  perfilProfile  from "@/assets/perfil_user.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Session } from "next-auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { useContext } from "react";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import MarcaNueva from "../marcas/MarcaNueva";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BibliotecaContext } from "@/contexts/BibliotecaContext";
import UploadFiles from "../files/UploadFiles";
import { toast } from "sonner";
import NewPublicacion from "../publicacion/NewPublicacion";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import HoverAdmin from "../HoverAdmin";
import { IUser } from "shared-lib/models/user.model";
import { useRouter } from "next/navigation";

export default function AppHeader() {
  const {
    marcas,
    isMarcaLoading,
    setMarcaGlobalSeleccionada,
    marcaGlobalSeleccionada,
    isOpenModalNuevaMarca,
    setIsOpenModalNuevaMarca,
  } = useContext(MisMarcasContext);
  const router = useRouter();

  const { setIsOpenModalNewFile, isOpenModalNewFile } =
    useContext(BibliotecaContext);

  const { isOpenModalNewPost, setIsOpenModalNewPost } =
    useContext(CalendarioContext);

  const { data: session, status } = useSession();

  const handlerLogout = (e: any) => {
    e.preventDefault();
    setMarcaGlobalSeleccionada(null);

    signOut({ callbackUrl: "/" });
  };

  const handlerLogin = (e: any) => {
    e.preventDefault();
    setMarcaGlobalSeleccionada(null);

    signIn("google", { callbackUrl: "/calendario" });
  };

  const handlerMarcaSelectedChanged = (idSelected: string) => {
    if (!idSelected) return;
    const marcaSelected = marcas.find((marca) => marca._id === idSelected);
    setMarcaGlobalSeleccionada(marcaSelected || null);
  };

  const setIsOpenModalNewFileHandler = () => {
    if (marcaGlobalSeleccionada?._id) setIsOpenModalNewFile(true);
    else toast.info("Selecciona una marca primero");
  };

  const setIsOpenModalNewPostHandler = () => {

    if (marcaGlobalSeleccionada?._id)
      {
        setIsOpenModalNewPost(true);
        router.push("/calendario");
      } 
        
    else toast.info("Selecciona una marca primero");
  };

  return (
    // TODO: 1/3 ver como modificar el Header para que se vea bien en mobile, modificar h-20 tanto en el layout como aca
    <nav className="w-full top-0 start-0 bg-slate-900">
      <div className="flex  flex-wrap items-center justify-between w-full px-4">
        <div className="flex gap-4 justify-start">
          {/* Nombre de la app */}
          <Link
            href="/calendario"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            {/* <img src={Logo.src} className="h-8" alt="Kibo Logo" /> */}
            <h1 className="self-center text-2xl font-semibold whitespace-nowrap text-slate-100">
              Contenido
            </h1>
          </Link>
          {session && (
            <Link
              href="/biblioteca"
              className="text-xl text-slate-100 flex items-center"
            >
              <ImageUp size={16} absoluteStrokeWidth />
              Biblioteca
            </Link>
          )}
        </div>

        {/* SELECTOR DE MARCAS */}
        {session && (
          <div>
            {isMarcaLoading ? (
              <p className="text-slate-100">Cargando...</p>
            ) : // <p className="text-slate-100">Hay datos</p>
              marcas?.length <= 0 ? (
                <Button
                  className="flex gap-2"
                  onClick={() => setIsOpenModalNuevaMarca(true)}
                >
                  <CirclePlus size={16} absoluteStrokeWidth />
                  Crea tu primer marca
                </Button>
              ) : (
                <Select
                  onValueChange={handlerMarcaSelectedChanged}
                  value={
                    marcaGlobalSeleccionada
                      ? marcaGlobalSeleccionada?._id
                      : undefined
                  }
                >
                  <SelectTrigger className=" px-8">
                    <SelectValue placeholder="Selecciona una marca" />
                  </SelectTrigger>
                  <SelectContent className="over-nav">
                    {marcas?.map((marca) => (
                      <SelectItem
                        className="gap-5"
                        value={marca._id}
                        key={marca._id}
                      >
                        <div className="w-full flex justify-start items-center gap-3">
                          <span className="w-4">
                            {(marca.admin as IUser)._id === session?.user._id && (
                              <HoverAdmin />
                            )}
                          </span>
                          <span>{marca.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
          </div>
        )}

        {/* BOTON DE + && (BOTON DE LOGIN O DEL USUARIO)  */}
        <div className="flex gap-4 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* BOTON DE AGREAR UN NUEVO POST, MARCA, RED SOCIAL */}
          {session && (
            <HoverCard openDelay={1} closeDelay={5}>
              <HoverCardTrigger  onClick={setIsOpenModalNewPostHandler}>
                <CircleFadingPlus
                  className="m-4 p-0 cursor-pointer"
                  size={24}
                  color="#ffffff"
                  absoluteStrokeWidth
                  onClick={setIsOpenModalNewPostHandler}
                />
              </HoverCardTrigger>
              <HoverCardContent className="m-0 p-0 ">
                <div>
                  <Link href="/calendario">
                    <Button
                      className="m-0 w-full gap-1 "
                      variant={"ghost"}
                      onClick={setIsOpenModalNewPostHandler}
                    >
                      <CircleFadingPlus size={16} absoluteStrokeWidth />
                      Publicación
                    </Button>
                  </Link>
                  <Button
                    className="m-0 w-full gap-1"
                    variant={"ghost"}
                    onClick={setIsOpenModalNewFileHandler}
                  >
                    <ImageUp size={16} absoluteStrokeWidth />
                    Multimedia
                  </Button>

                  <Link href="/perfil/marcas">
                    <Button className="m-0 w-full gap-1" variant={"ghost"}>
                      <CircleFadingPlus size={16} absoluteStrokeWidth />
                      Red social
                    </Button>
                  </Link>
                  <Button
                    className="m-0 w-full gap-1"
                    variant={"ghost"}
                    onClick={() => setIsOpenModalNuevaMarca(true)}
                  >
                    <CircleFadingPlus size={16} absoluteStrokeWidth />
                    marca
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          )}

          {/* LOGIN BTN || UserProfile */}
          {session ? (
            <HoverCard openDelay={1} closeDelay={5}>
              <HoverCardTrigger href="/perfil/marcas">
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image}
                    alt="Foto de perfil"
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <AvatarFallback>
                    <Image
                      src={perfilProfile}
                      alt="Foto de perfil"
                      className="rounded-full w-auto h-auto object-cover"
                      width={40}
                      height={40}
                    />
                  </AvatarFallback>
                </Avatar>
              </HoverCardTrigger>
              <HoverCardContent className="m-0 p-0">
                <div>
                  <p className="m-0 w-full text-center font-medium">
                    {session.user.name}
                  </p>
                  <Link href="/perfil/marcas">
                    <Button className="m-0 w-full" variant={"ghost"}>
                      Mis marcas
                    </Button>
                  </Link>
                  <Link href="/perfil/mis-datos">
                    <Button className="m-0 w-full" variant={"ghost"}>
                      Mis datos
                    </Button>
                  </Link>

                  <Button
                    className="m-0 w-full"
                    variant={"ghost"}
                    onClick={handlerLogout}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Button onClick={handlerLogin}>
              <Mail className="mr-2 h-4 w-4" /> Login
            </Button>
          )}
        </div>
      </div>
      <MarcaNueva
        isOpenModalNuevaMarca={isOpenModalNuevaMarca}
        setIsOpenModalNuevaMarca={setIsOpenModalNuevaMarca}
      />

      <UploadFiles
        isOpenModalNewFile={isOpenModalNewFile}
        setIsOpenModalNewFile={setIsOpenModalNewFile}
      />

      {/* <NewPublicacion
        isOpenModalNewPost={isOpenModalNewPost}
        setIsOpenModalNewPost={setIsOpenModalNewPost}
      /> */}
    </nav>
  );
}
