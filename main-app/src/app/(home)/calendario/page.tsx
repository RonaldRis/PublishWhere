"use client";
import { CalendarioContext } from "@/contexts/CalendarioContext";
import { getMonthDaysjs } from "@/lib/utils";
import { Suspense, useContext, useEffect, useState } from "react";
import EventModal from "./_components/EventModal";
import HeaderCalendar from "./_components/HeaderCalendar";
import SidebarCalendario from "./_components/SidebarCalendario";
import Month from "./_components/Month";
import { use } from "passport";
import dayjs from "dayjs";

function DashboardPage() {
  const {setMonthIndex, setSmallCalendarMonth, currenMonthMatrix, showEventModal } = useContext(CalendarioContext);

  useEffect(() => {
    const mes = dayjs().month();
    setMonthIndex(mes);
    setSmallCalendarMonth(mes);
  }, []);


  return (
    <>
      {showEventModal && <EventModal />}

      <Suspense>
        <div className="h-full flex flex-col mt-0 top-0">
          <HeaderCalendar />
          <div className="flex flex-1">
            <SidebarCalendario />
            <Month month={currenMonthMatrix} />
          </div>
        </div>
      </Suspense>
    </>
  );
}

export default DashboardPage;
