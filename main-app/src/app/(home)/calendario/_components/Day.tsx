"use client";
import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import { CalendarioContext, IEventCalendar } from "@/contexts/CalendarioContext";
import "dayjs/locale/es"; // importa el locale español
import { LucideAArrowDown } from "lucide-react";

export default function Day({ day, rowIdx }: { day: dayjs.Dayjs; rowIdx: number }) {

  dayjs.locale("es");

  const [dayEvents, setDayEvents] = useState<IEventCalendar[]>([]);
  const {
    setDaySelected,
    setIsOpenModalNewPost,
    filteredEvents,
    setSelectedEvent,
    setSelectedFileList,
    setSelectedRedesSocialesList
  } = useContext(CalendarioContext);

  useEffect(() => {
    const events = filteredEvents.filter(
      (evt) => {
        return dayjs(evt.programmedDate).format("DD-MM-YY") === day.format("DD-MM-YY");
      }
    );
    setDayEvents(events);
  }, [filteredEvents, day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }
  return (
    <div className="border border-gray-200 flex flex-col">
      <header className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-sm p-1 my-1 text-center cursor-pointer ${getCurrentDayClass()}`}
          onClick={() => {
            setDaySelected(day);
            setIsOpenModalNewPost(true);
          }}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(day);
          setIsOpenModalNewPost(true);
        }}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={evt.id}
            onClick={() => {
              

              setSelectedFileList(evt.files.map((f) => ({ ...f, isFavorited: false })));
              setSelectedRedesSocialesList(evt.socialMedia.map((sm) => sm.socialMedia));

              setSelectedEvent(evt)}
            } 
            className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
          >
            <p>
              {evt.title}
            </p>
            {/* ICONS */}
            <div className="flex">

            <LucideAArrowDown />
            <LucideAArrowDown />
            <LucideAArrowDown />
            <LucideAArrowDown />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
