"use client";

import { Button } from "@/components/ui/button";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import clsx from "clsx";
import {
  FileIcon,
  FileInput,
  FileX2,
  PanelLeftClose,
  PanelRightClose,
  StarIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export function SideNav() {
  const pathname = usePathname();

  const { selectedFileList, setSelectedFileList, isCalendarPage, setIscalendarPage } = useContext(CalendarioContext);


  useEffect(() => {
    setIscalendarPage(false); //Biblioteca
    setSelectedFileList([]);
  }, []);


  const [show, setShow] = useState(true);

  return (
    <div className="w-auto flex flex-col gap-4">
      <Button
        variant={"ghost"}
        className="flex gap-2 place-self-end"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? (
          <>
            Ocultar lateral
            <PanelLeftClose />
          </>
        ) : (
          <PanelRightClose />
        )}
      </Button>

      {show && (
        <>
          <Link href="/biblioteca/files">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/files"),
              })}
            >
              <FileIcon /> Todos
            </Button>
          </Link>

          {/* <Link href="/biblioteca/favoritos">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/favoritos"),
              })}
            >
              <StarIcon /> Favoritos
            </Button>
          </Link> */}

          

          <Link href="/biblioteca/programados">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/programados"),
              })}
            >
              <FileInput />
              Programados
            </Button>
          </Link>

          <Link href="/biblioteca/usados">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/usados"),
              })}
            >
              <FileInput />
              Usados
            </Button>
          </Link>

          <Link href="/biblioteca/no-usados">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/favorites"),
              })}
            >
              <FileX2 />
              No usados
            </Button>
          </Link>

          <Link href="/biblioteca/papelera">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/trash"),
              })}
            >
              <TrashIcon /> Papelera
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
