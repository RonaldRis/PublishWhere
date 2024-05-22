"use client";
import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import { CalendarioContext, IEventCalendar } from "@/contexts/CalendarioContext";
import "dayjs/locale/es"; // importa el locale español
import { LucideAArrowDown } from "lucide-react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


export default function Day({ day, rowIdx }: { day: dayjs.Dayjs; rowIdx: number }) {

  dayjs.locale("es");

  const [dayEvents, setDayEvents] = useState<IEventCalendar[]>([]);
  const {
    setDaySelected,
    setIsOpenModalNewPost,
    filteredEvents,
    setSelectedEvent,
    setSelectedFileList,
    setSelectedRedesSocialesList,
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


  const handlerDayClickOpenModal = () => {
    setDaySelected(day);
    setIsOpenModalNewPost(true);
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
         onClick={handlerDayClickOpenModal}
        >
          {day.format("DD")}
        </p>
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={handlerDayClickOpenModal}
      >
        {dayEvents.map((evt, idx) => (
          <div
            key={evt._id}
            //TODO: CAMBIE ESTO DE id a _id
            onClick={() => {


              setSelectedFileList(evt.files.map((f) => ({ ...f, isFavorited: false })));
              setSelectedRedesSocialesList(evt.socialMedia.map((sm) => sm.socialMedia));

              setSelectedEvent(evt)
            }
            }
            className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
          >
            <p className="text-xs">
              {evt.title}
            </p>
            {/* ICONS */}
            <div className="flex gap-2 flex-wrap">
              {evt.socialMedia.map((sm) => (

                <HoverCard
                  key={sm.socialMedia._id}
                >
                  <HoverCardTrigger>
                    <Image
                      src={sm.socialMedia.thumbnail}
                      width={24}
                      height={24}
                      className="rounded-full"
                      alt="Description of the image"
                      style={{ objectFit: "contain" }}
                    />
                  </HoverCardTrigger>
                  <HoverCardContent >
                    <Image
                      key={sm.socialMedia._id}
                      src={sm.socialMedia.thumbnail}
                      width={24}
                      height={24}
                      className="rounded-full object-contain"
                      alt="Description of the image"
                    />
                    {sm.socialMedia.name}
                    <br />
                    {sm.socialMedia.provider}
                  </HoverCardContent>
                </HoverCard>

              ))
              }

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
