"use client";
import dayjs from "dayjs";
import React, { useContext, useEffect } from "react";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { logoCalendario } from "@/assets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "dayjs/locale/es"; // importa el locale español

export default function HeaderCalendar() {
  dayjs.locale("es");

  const { monthIndex, setMonthIndex } = useContext(CalendarioContext);

  useEffect(() => {
    console.log("monthIndex - UseEffect", monthIndex);
  }, [monthIndex]);
  
  function handlePrevMonth() {
    const nuevoMes = monthIndex - 1;
    setMonthIndex(nuevoMes);
  }
  function handleNextMonth() {
    const nuevoMes = monthIndex + 1;
    setMonthIndex(nuevoMes);
  }
  function handleReset() {
    const indexReset =
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month();

    setMonthIndex(indexReset);
  }
  return (
    <header className="px-4 py-2 flex items-center">
      <img src={logoCalendario.src} alt="calendar" className="mr-2 w-12 h-12" />
      <h1 className="mr-10 text-xl text-gray-500 fond-bold">Calendar</h1>
      <button onClick={handleReset} className="border rounded py-2 px-4 mr-5">
        Today
      </button>
      <button onClick={handlePrevMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          <ChevronLeft />
        </span>
      </button>
      <button onClick={handleNextMonth}>
        <span className="material-icons-outlined cursor-pointer text-gray-600 mx-2">
          <ChevronRight />
        </span>
      </button>
      <h2 className="ml-4 text-xl text-gray-500 font-bold">
        {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
      </h2>
    </header>
  );
}
