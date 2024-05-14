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
import { useLocalStorage } from "usehooks-ts";
import { IFile, IFileFavorite } from "shared-lib/models/file.model";

function CalendarioPage() {
  const { selectedFileList, setSelectedFileList, isCalendarPage, setIscalendarPage, setSelectedRedesSocialesList } = useContext(CalendarioContext);


  useEffect(() => {
    setSelectedRedesSocialesList([]);
    setIscalendarPage(true);
    setSelectedFileList([]);
  }, []);


  const { setMonthIndex, setSmallCalendarMonth, currenMonthMatrix, isOpenModalNewPost } = useContext(CalendarioContext);

  useEffect(() => {
    const mes = dayjs().month();
    setMonthIndex(mes);
    setSmallCalendarMonth(mes);
  }, []);


  return (
    <>
      {isOpenModalNewPost && <EventModal />}

      <div className="h-full flex flex-col mt-0 top-0">
        <HeaderCalendar />
        <div className="flex flex-1">
          <SidebarCalendario />
          <Month month={currenMonthMatrix} />
        </div>
      </div>
    </>
  );
}

export default CalendarioPage;
