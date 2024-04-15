"use client";
import React, { useContext } from "react";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { plusImg } from "@/assets";
export default function CreateEventButton() {
  const { setShowEventModal } = useContext(CalendarioContext);
  return (
    <button
      onClick={() => setShowEventModal(true)}
      className="border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl"
    >
      <img src={plusImg.src} alt="create_event" className="w-7 h-7" />
      <span className="pl-3 pr-7"> Create</span>
    </button>
  );
}
