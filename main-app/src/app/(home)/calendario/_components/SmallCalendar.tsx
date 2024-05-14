"use client";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { getMonthDaysjs } from "@/lib/utils";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState<number>(
    dayjs().month()
  );
  const [currentMonthMatrix, setCurrentMonthMatrix] = useState<dayjs.Dayjs[][]>(
    getMonthDaysjs()
  );

  useEffect(() => {
    setCurrentMonthMatrix(getMonthDaysjs(currentMonthIdx));
  }, [currentMonthIdx]);

  const { monthIndex, setSmallCalendarMonth, setDaySelected, daySelected } =
    useContext(CalendarioContext);

  useEffect(() => {
    setCurrentMonthIdx(monthIndex);
  }, [monthIndex]);

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }
  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }
  function getDayClass(day: dayjs.Dayjs) {
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return "bg-blue-500 rounded-full text-white";
    } else if (currDay === slcDay) {
      return "bg-blue-100 rounded-full text-blue-600 font-bold";
    } else {
      return "";
    }
  }
  return (
    <div className="mt-9">
      <header className="flex justify-between items-center">
        <p className="text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format("MMMM YYYY")}
        </p>
        <div>
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
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonthMatrix[0].map((day, i) => (
          <span key={day.format("MM-dd")} className="text-sm py-1 text-center">
            {day.format("dd").charAt(0)}
          </span>
        ))}
        {currentMonthMatrix.map((row, i) => (
          <React.Fragment key={i}>
            {row.map((day, idx) => (
              <button
                key={day.format("YYYY-MM-DD")}  
                onClick={() => {
                  setSmallCalendarMonth(currentMonthIdx);
                  setDaySelected(day);
                }}
                className={`py-1 w-full ${getDayClass(day)}`}
              >
                <span className="text-sm">{day.format("D")}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
