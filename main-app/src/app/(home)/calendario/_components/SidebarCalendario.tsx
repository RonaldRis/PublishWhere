"use client";
import React from "react";
import CreateEventButton from "./CreateEventButton";
import SmallCalendar from "./SmallCalendar";
import MarcasLabels from "./MarcasLabels";
export default function SidebarCalendario() {
  return (
    <aside className="border p-5 w-64">
      <CreateEventButton />
      <SmallCalendar />
      <MarcasLabels />
    </aside>
  );
}
