"use client";
import { getMonthDaysjs } from "@/lib/utils";
import { IFileFavorite } from "shared-lib/models/file.model";
import { ISocialMediaAccount } from "shared-lib/models/socialMediaAccount.model";
import { da } from "date-fns/locale";
import dayjs from "dayjs";
import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
  Dispatch,
  ReactNode,
} from "react";
import { useLocalStorage } from "usehooks-ts";

export interface IEventCalendar {
  // Define the shape of your event objects here
  id: number; //TODO: NUMNBER OR STRING??
  title: string;
  description: string;
  label: string;
  day: number;
}

export interface ILabelCalendar {
  // Define the shape of your label objects here
  label: string;
  checked: boolean;
  socialMedia?: string;
}

///CONTEXT INTERFACE:
export interface ICalendarioContext {
  currenMonthMatrix: dayjs.Dayjs[][] | undefined;
  setCurrentMonthMatrix: React.Dispatch<
    React.SetStateAction<dayjs.Dayjs[][] | undefined>
  >;
  monthIndex: number;
  setMonthIndex: React.Dispatch<React.SetStateAction<number>>;
  smallCalendarMonth: number | null;
  setSmallCalendarMonth: React.Dispatch<React.SetStateAction<number | null>>;
  daySelected: dayjs.Dayjs | null;
  setDaySelected: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  dispatchCalEvent: Dispatch<{ type: string; payload: any }>;
  savedEvents: IEventCalendar[];
  selectedEvent: IEventCalendar | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<IEventCalendar | null>>;
  labels: ILabelCalendar[];
  setLabels: React.Dispatch<React.SetStateAction<ILabelCalendar[]>>;
  updateLabel: (label: ILabelCalendar) => void;
  filteredEvents: IEventCalendar[];

  isOpenModalNewPost: boolean;
  setIsOpenModalNewPost: React.Dispatch<React.SetStateAction<boolean>>;
  isCalendarPage: boolean;
  setIscalendarPage: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFileList: IFileFavorite[];
  setSelectedFileList: React.Dispatch<React.SetStateAction<IFileFavorite[]>>;
  selectedRedesSocialesList: ISocialMediaAccount[];
  setSelectedRedesSocialesList: React.Dispatch<React.SetStateAction<ISocialMediaAccount[]>>;

}

///CONTEXT:
const CalendarioContext = React.createContext<ICalendarioContext>({
  currenMonthMatrix: undefined,
  setCurrentMonthMatrix: () => { },
  monthIndex: dayjs().month(),
  setMonthIndex: () => { },
  smallCalendarMonth: dayjs().month(),
  setSmallCalendarMonth: () => { },
  daySelected: null,
  setDaySelected: () => { },
  dispatchCalEvent: ({ type, payload }) => { },
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => { },
  setLabels: () => { },
  labels: [],
  updateLabel: () => { },
  filteredEvents: [],
  isOpenModalNewPost: false,
  setIsOpenModalNewPost: () => { },
  isCalendarPage: false,
  setIscalendarPage: () => { },
  selectedFileList: [],
  setSelectedFileList: () => { },
  selectedRedesSocialesList: [],
  setSelectedRedesSocialesList: () => { },
});

// TODO: IEvent[] no estoy seguro si es el tipo correcto
function savedEventsReducer(
  state: IEventCalendar[],
  { type, payload }: { type: string; payload: any }
) {
  switch (type) {
    case "push":
      return [...state, payload];
    case "update":
      return state.map((evt) => (evt.id === payload.id ? payload : evt));
    case "delete":
      return state.filter((evt) => evt.id !== payload.id);
    default:
      throw new Error();
  }
}

function initEvents() {
  let storageEvents = null;
  if (typeof window !== 'undefined') {
    storageEvents = window.localStorage.getItem("savedEvents");
  }
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

///PROVIDER:
const CalendarioProvider = ({ children }: { children: ReactNode }) => {
  const [monthIndex, setMonthIndex] = useState<number>(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] = useState<number | null>(
    null
  ); //TODO: NO IDEA WHAT THIS IS

  const [currenMonthMatrix, setCurrentMonthMatrix] = useState<
    dayjs.Dayjs[][] | undefined
  >(undefined);


  const [isCalendarPage, setIscalendarPage] = useLocalStorage<boolean>("isCalendarPage", true);
  const [selectedFileList, setSelectedFileList] = useLocalStorage<IFileFavorite[]>("selectedFileList", []);
  const [selectedRedesSocialesList, setSelectedRedesSocialesList] = useLocalStorage<ISocialMediaAccount[]>("selectedRedesSocialesList", []);



  const [isOpenModalNewPost, setIsOpenModalNewPost] = useState(false);
  const [daySelected, setDaySelected] = useState<dayjs.Dayjs>(dayjs());
  const [selectedEvent, setSelectedEvent] = useState<IEventCalendar | null>(
    null
  );
  const [labels, setLabels] = useState<ILabelCalendar[]>([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
    initEvents
  );

  const filteredEvents = useMemo(() => {
    return savedEvents.filter((evt: IEventCalendar) =>
      labels
        .filter((lbl: ILabelCalendar) => lbl.checked)
        .map((lbl: ILabelCalendar) => lbl.label)
        .includes(evt.label)
    );
  }, [savedEvents, labels]);

  useEffect(() => {
    localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
  }, [savedEvents]);

  // TODO: REPASAR ESTO PARA QUE FUNCIONA O VER DONDE SE USA Y COMO (Posiblmente no se use para editar)
  // useEffect(() => {
  //   setLabels((prevLabels) => {
  //     return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
  //       const currentLabel = prevLabels.find((lbl) => lbl.label === label);
  //       return {
  //         label,
  //         checked: currentLabel ? currentLabel.checked : true,
  //       };
  //     });
  //   });
  // }, [savedEvents]);

 

  useEffect(() => {
    // Extraer los labels de los eventos guardados
    const labelsFromEvents = savedEvents.map((evt) => evt.label);
  
    // Eliminar duplicados
    const uniqueLabels = Array.from(new Set(labelsFromEvents));
  
    // Actualizar el estado de los labels
    setLabels((prevLabels) => {
      return uniqueLabels.map((label) => {
        const currentLabel = prevLabels.find((lbl) => lbl.label === label);
        return {
          label,
          checked: currentLabel ? currentLabel.checked : true,
        };
      });
    });
  }, [savedEvents]);
  

  useEffect(() => {
    if (smallCalendarMonth !== null) {
      setMonthIndex(smallCalendarMonth);
    }
  }, [smallCalendarMonth]);

  useEffect(() => {
    if (!isOpenModalNewPost) {
      setSelectedEvent(null);
    }
  }, [isOpenModalNewPost]);

  useEffect(() => {
    console.log("monthIndex", monthIndex);
    setCurrentMonthMatrix(getMonthDaysjs(monthIndex));
  }, [monthIndex]);

  function updateLabel(label: ILabelCalendar) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <CalendarioContext.Provider
      value={{
        currenMonthMatrix,
        setCurrentMonthMatrix,
        monthIndex: monthIndex,
        setMonthIndex: setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
        isOpenModalNewPost,
        setIsOpenModalNewPost,
        isCalendarPage,
        setIscalendarPage,
        selectedFileList,
        setSelectedFileList,
        selectedRedesSocialesList,
        setSelectedRedesSocialesList

      }}
    >
      {children}
    </CalendarioContext.Provider>
  );
};

export { CalendarioProvider, CalendarioContext };
