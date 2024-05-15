"use client";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { CheckIcon } from "lucide-react";
import { labelsClasses } from "@/lib/constantes";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { CircleX, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { toast } from "sonner";
import { FileBrowser } from "@/app/(home)/biblioteca/_components/file-browser";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileCard } from "@/app/(home)/biblioteca/_components/file-card";
import RedSocialCardChip from "./RedSocialCardChip";
import { ISocialMediaAccount } from "shared-lib/models/socialMediaAccount.model";
import { IPublicationPost } from "shared-lib/models/publicaction.model";
import { postPublicationAction } from "@/lib/actions/publications.actions";
import { set } from "mongoose";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";



export default function EventModal() {
  const {
    setIsOpenModalNewPost,
    isOpenModalNewPost,
    daySelected,
    dispatchCalEvent,
    selectedEvent,
    selectedFileList, setSelectedFileList,
    selectedRedesSocialesList, setSelectedRedesSocialesList
  } = useContext(CalendarioContext);

  const {
    marcaGlobalSeleccionada
  } = useContext(MisMarcasContext);

  const { data: session } = useSession();

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [noErrors, setNoErrors] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState(
    selectedEvent ? selectedEvent.title : ""
  );
  const [description, setDescription] = useState(
    selectedEvent ? selectedEvent.description : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedEvent
      ? labelsClasses.find((lbl) => lbl === selectedEvent.label)
      : labelsClasses[0]
  );

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!noErrors) {
      toast.error("Revisa los campos de la publicación");
      return;
    }

    const publication: IPublicationPost = {
      title: title,
      creatorId: session?.user?.id as string,
      files: selectedFileList.map(f => f._id),
      alreadyPosted: false,
      isSchedule: false,
      programmedDate: daySelected?.toDate() as Date,
      programmedTime: daySelected?.toDate() as Date,
      isPostingInProgress: false,
      socialMedia: selectedRedesSocialesList.map(red => ({
        provider: red.provider,
        idPublicacionOnProvider: "",
        urlPost: "",
        socialMedia: red._id
      }))
    }

    console.log("publication", publication);


    const result = await postPublicationAction(publication);
    if (!result.isOk) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);



    //////CODIGO UI
    const calendarEvent = {
      title,
      description,
      label: selectedLabel, //TODO: Change??? Esto le a el color
      day: daySelected?.valueOf(),
      id: result.data?._id,
    };
    if (selectedEvent) {
      dispatchCalEvent({ type: "update", payload: calendarEvent });
    } else {
      dispatchCalEvent({ type: "push", payload: calendarEvent });
    }

    setIsOpenModalNewPost(false);
    setSelectedFileList([]);
    setSelectedRedesSocialesList([]);
    setTitle("");

  }

  const validacionesOk = () => {

    var newMessage = "";
    var noErrors = true;




    ///Validar que el titulo no este vacio
    newMessage = selectedRedesSocialesList.length === 0 ? "Selecciona al menos un red social" : "";
    // noErrors = newMessage.length === 0 ? false : true; //TODO: Revisar luego si el texto puede ser vacio


    ///Si ha seleccionado twitter no puede pasarse de 280
    selectedRedesSocialesList.map((red: ISocialMediaAccount) => {
      if (red.provider === "twitter" && title.length > 280) {
        newMessage = newMessage + "\nTwitter: El mensaje no puede superar los 280 letras";
        noErrors = false;
      }

      if (red.provider === "youtube" && title.length > 100) { //TODO: Validar duracion de video <60 segundos si es short
        newMessage = newMessage + "\nYoutube shorts: El mensaje no puede superar los 100 letras";
        noErrors = false;
      }
    })

    if (selectedFileList.length > 1 && selectedRedesSocialesList.some(red => red.provider === "youtube")) {
      newMessage = newMessage + "\nYoutube: Solo se puede subir un video por publicación";
      noErrors = false;
    }

    if (selectedFileList.length > 4 && selectedRedesSocialesList.some(red => red.provider === "twitter")) {
      newMessage = newMessage + "\nTwitter: Solo acepta hasta 4 videos por publicación";
      noErrors = false;
    }

    if (selectedFileList.some(f => f.type === "image") && selectedRedesSocialesList.some(red => red.provider === "youtube")) {
      newMessage = newMessage + "\nYouTube: No se pueden subir imagenes a YouTube";
      noErrors = false;
    }

    setMessage(newMessage);
    setNoErrors(noErrors);

  }



  useEffect(() => {
    validacionesOk();
  }, [selectedRedesSocialesList, selectedFileList, title, description]); //TODO: FECHA PROGRAMDOS






  return (

    <AlertDialog onOpenChange={setIsOpenModalNewPost} open={isOpenModalNewPost}>
      <AlertDialogContent
        className="flex flex-col justify-between over-nav 
            h-[95vh] 
          sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl 
           overflow-y-scroll "
      >
        {/* HEADER */}
        <AlertDialogHeader className="flex">
          <AlertDialogTitle className="text-2xl">Crear nueva publicación</AlertDialogTitle>
          <AlertDialogDescription>
            Deja llevar tu creatividad y comparte contenido de valor
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Button
          variant={"ghost"}
          className="absolute top-6 right-6 "
          onClick={() => setIsOpenModalNewPost(false)}
        >
          <CircleX size={32} />
        </Button>

        {/* CONTENT */}

        {/* //TODO: Unicamente se pueden eliminar los posts que son programador */}
        {/* 
        <header className="bg-gray-100 px-4 py-2 flex justify-between items-center">
          <span className="material-icons-outlined text-gray-400">
            drag_handle
          </span>
          <div>
            {selectedEvent && (
              <span
                onClick={() => {
                  dispatchCalEvent({
                    type: "delete",
                    payload: selectedEvent,
                  });
                  setIsOpenModalNewPost(false);
                }}
                className="material-icons-outlined text-gray-400 cursor-pointer"
              >
                delete
              </span>
            )}
            <button onClick={() => setIsOpenModalNewPost(false)}>
              <span className="material-icons-outlined text-gray-400">
                close
              </span>
            </button>
          </div>
        </header> */}
        <div className="p-3">
          <div className="grid grid-cols-1/5 items-end gap-y-7">
            <div></div>
            <textarea
              name="title"
              placeholder="Descripción de la publicación"
              value={title}
              required
              rows={5}
              className="pt-3 border-0  text-base font-semibold pb-2 w-full border-b-2 border-gray-200 focus:outline-none focus:ring-0 focus:border-blue-500"
              onChange={(e) => setTitle(e.target.value)}
            />
            <span> Carácteres: {" "}
            </span>
            <span>
              {title.length + " "}

            </span>

            {message &&
              <>
                <span> Validaciones: {" "}
                </span>
                <span>
                  {message.split("\n").map((m, index) => (
                    <p key={index} className="text-blue-600">{m}</p>
                  ))}
                </span>
              </>
            }


            <span className="material-icons-outlined">
              schedule
            </span>
            <p>{daySelected?.format("dddd, MMMM DD")}</p>
          </div>

          <br />
          <span className="material-icons-outlined">
            Redes sociales:
          </span>
          <br />
          <div className="flex gap-2 flex-wrap justify-evenly">
            {marcaGlobalSeleccionada?.socialMedia.map((social) => (

              <RedSocialCardChip key={social._id} social={social} />
            ))}
          </div>



          <div>
            <div className="w-full flex items-center justify-center p-4">

              <Button className="px-16 py-8 "
                onClick={() => setIsLibraryOpen(true)}
              >
                Abrir biblioteca
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFileList.map((file, i) => (
                <FileCard key={file._id} file={file} />
              ))}

            </div>


          </div>
        </div>
        <Drawer onOpenChange={setIsLibraryOpen} open={isLibraryOpen}>
          <DrawerContent>

            {/* <DrawerContent className="over-over-nav  flex flex-col justify-between over-nav 
            h-[75vh] bg-gray-400 w-full
            bottom-[0%] top-[25%]  translate-y-0
            

          sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl 
           overflow-y-scroll"> */}
            <DrawerHeader>
              <DrawerTitle>Selecciona tus archivos de la biblioteca</DrawerTitle>
              <DrawerDescription>This action cannot be undone.</DrawerDescription>
            </DrawerHeader>
            <FileBrowser title="Selecciona los archivos de la publicación" />
          </DrawerContent>
        </Drawer>


        {/* FOOTER */}
        <AlertDialogFooter className="bottom-0 h-[80vh] flex justify-end border-t p-3 mt-5">

          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button onClick={handleSubmit} >
            Publicar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
