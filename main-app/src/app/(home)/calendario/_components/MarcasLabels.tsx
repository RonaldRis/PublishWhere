"use client";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { labelsColorToProvider } from "@/lib/constantes";
import { Calendar } from "lucide-react";
import Image from "next/image";
import React, { useContext } from "react";




export default function MarcasLabels() {
  const { labels, updateLabel } = useContext(CalendarioContext);
  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);


  return (
    <React.Fragment>
      <p className="text-gray-500 font-bold mt-10">Redes sociales:</p>
      {labels.map(({ label: lbl, checked, socialMedia }) => (
        <label key={socialMedia?._id} className="flex items-center justify-start mt-3 block">
          <input
            type="checkbox"
            checked={checked}
            onChange={() =>
              updateLabel({ _id: socialMedia?._id, label: lbl, checked: !checked, socialMedia })
            }
            className={`form-checkbox h-5 w-5 accent-${lbl}-400 rounded focus:ring-0 cursor-pointer`}
          />
          {socialMedia?.thumbnail && (
            <Image
              src={socialMedia?.thumbnail}
              width={24}
              height={24}
              className="rounded-full ml-2"
              alt="Description of the image"
              style={{ objectFit: "contain" }}
            />
          )}
          <span className="ml-2 w-full text-gray-700 capitalize text-wrap break-words">{socialMedia?.name} <span className="text-xs">{socialMedia?.provider}</span></span>
        </label>
      ))}
    </React.Fragment>
  );
}
