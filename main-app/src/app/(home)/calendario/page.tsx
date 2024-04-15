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
  const {setMonthIndex, setSmallCalendarMonth,smallCalendarMonth, monthIndex, showEventModal } = useContext(CalendarioContext);

  const [currenMonth, setCurrentMonth] = useState<dayjs.Dayjs[][]>(getMonthDaysjs());


  //TODO: REVISAR EL QUE AGARRE EL MES CORRECTO AL INICIAR LA APP
  useEffect(() => {
    console.log("monthIndex - UseEffect", monthIndex);
    setCurrentMonth(getMonthDaysjs(monthIndex));
  }, [monthIndex]);


  return (
    <>
      {showEventModal && <EventModal />}

      <Suspense>
        <div className="h-screen flex flex-col">
          <HeaderCalendar />
          <div className="flex flex-1">
            <SidebarCalendario />
            <Month month={currenMonth} />
          </div>
        </div>
      </Suspense>
    </>
  );
}

export default DashboardPage;
