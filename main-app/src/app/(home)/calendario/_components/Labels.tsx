"use client";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { Calendar } from "lucide-react";
import React, { useContext } from "react";


//TODO: ASOCIAL A YOUTUBE, FACEBOOK, INSTAGRAM,TIKTOK, TWITTER
export const labelsClasses = [
  "indigo",
  "gray",
  // "green",
  "blue",
  "red",
  "purple",
];

//convertir de Nombre de red social a color:
export const labelsProviderToColor = {
  "indigo": "twitter",
  "gray": "tiktok",
  "blue": "facebook",
  "red": "youtube",
  "purple": "instagram",
};


export default function Labels() {
  const { labels, updateLabel } = useContext(CalendarioContext);
  return (
    <React.Fragment>
      <p className="text-gray-500 font-bold mt-10">Label</p>
      {labels.map(({ label: lbl, checked }, idx) => (
        <label key={idx} className="items-center mt-3 block">
          <input
            type="checkbox"
            checked={checked}
            onChange={() =>
              updateLabel({ label: lbl, checked: !checked })
            }
            className={`form-checkbox h-5 w-5 accent-${lbl}-400 rounded focus:ring-0 cursor-pointer`}
          />
          <span className="ml-2 text-gray-700 capitalize">{labelsProviderToColor[lbl]}</span>
        </label>
      ))}
    </React.Fragment>
  );
}
