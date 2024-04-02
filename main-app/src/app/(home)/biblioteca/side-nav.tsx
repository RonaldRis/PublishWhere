"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, PanelLeftClose, PanelRightClose, StarIcon, TrashIcon } from "lucide-react";
import { set } from "mongoose";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SideNav() {
  const pathname = usePathname();

  const [show, setShow] = useState(true);


  return (
    <div className="w-auto flex flex-col gap-4">
      <Button
        variant={"ghost"}
        className="flex gap-2 place-self-end"
        onClick={() => {
          console.log("click");
          setShow(!show);
        }}
      >
        {show ?
          <>
            Ocultar lateral
            <PanelLeftClose />
          </>
          :
          <PanelRightClose />
        }

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
              <FileIcon /> All Files
            </Button>
          </Link>

          <Link href="/biblioteca/favorites">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/favorites"),
              })}
            >
              <StarIcon /> Already used
            </Button>
          </Link>

          <Link href="/biblioteca/favorites">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/favorites"),
              })}
            >
              <StarIcon /> Not used yet
            </Button>
          </Link>

          <Link href="/biblioteca/trash">
            <Button
              variant={"link"}
              className={clsx("flex gap-2", {
                "text-blue-500": pathname.includes("/biblioteca/trash"),
              })}
            >
              <TrashIcon /> Trash
            </Button>
          </Link>
        </>


      )}


    </div>
  );
}
