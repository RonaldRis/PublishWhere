"use client";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { Calendar } from "lucide-react";
import React, { useContext } from "react";
import { labelsClasses } from "./EventModal";


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
          <span className="ml-2 text-gray-700 capitalize">{lbl}</span>
        </label>
      ))}
    </React.Fragment>
  );
}
