"use client";
import { getMonthDaysjs } from "@/lib/utils";
import { IFile, IFileFavorite } from "shared-lib/models/file.model";
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
  useContext,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { getPublicationByMarcaAction } from "@/lib/actions/publications.actions";
import { MisMarcasContext } from "./MisMarcasContext";
import { labelsProviderToColor } from "@/lib/constantes";
import { IPublication } from "shared-lib/models/publicaction.model";

export interface IEventCalendar extends IPublication {
  // Define the shape of your event objects here
  id: string; //TODO: NUMNBER OR STRING??
  label: string;
}

export interface ILabelCalendar {
  // Define the shape of your label objects here
  label: string;
  checked: boolean;
  socialMedia?: ISocialMediaAccount;
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
  { type, payload }: { type: string; payload: IEventCalendar }
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


///PROVIDER:
const CalendarioProvider = ({ children }: { children: ReactNode }) => {

  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);



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
  // const [selectedEvent, setSelectedEvent] = useLocalStorage<IEventCalendar | null>("selectedEvent", null);
  const [selectedEvent, setSelectedEvent] = useState<IEventCalendar | null>(null);

  const [labels, setLabels] = useState<ILabelCalendar[]>([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [],
  );

  const filteredEvents = useMemo(() => {
    console.log("labels", labels);
    // return savedEvents.filter((evt: IEventCalendar) => {
    //   console.log("evt", evt);
    //   return evt.socialMedia?.some((sm) =>
    //     labels.some((lbl) => lbl.socialMedia?._id === sm.socialMedia._id)
    //   );
    // });

    const filter = savedEvents.filter((evt) => {
      return labels.some((lbl) =>  evt.label.includes(lbl.label) && lbl.checked) ?? false;
    });
    console.log("filter", filter.length);

    //Elimino los repetidos de _id
    var dataUnique: IEventCalendar[] = [];
    const unique = filter.map((event) =>{
      if(!dataUnique.some((e) => e._id === event._id))
        dataUnique.push(event);
    } );
    console.log("dataUnique", dataUnique.length);

    return dataUnique;

  }, [savedEvents, labels]);



  //TODO: HACER LOS LABELS EN FUNCION DE CADA RED SOCIAL DE LA MARCA
  useEffect(() => {
    // Actualizar el estado de los labels

    console.log("marcaGlobalSeleccionada", marcaGlobalSeleccionada);
    if (!marcaGlobalSeleccionada) {
      return;
    }
    console.log("marcaGlobalSeleccionada", marcaGlobalSeleccionada);

    const redesSociales = marcaGlobalSeleccionada?.socialMedia ?? [];
    const labelsNuevos: ILabelCalendar[] = redesSociales.map((redSocial) => {
      return {
        label: labelsProviderToColor[redSocial.provider] ?? "gray",
        checked: true,
        socialMedia: redSocial
      }
    }) ?? [];
    setLabels(labelsNuevos);

    console.log("labelsNuevos", labelsNuevos);

    const updatePublicacionesFromDatabase = async () => {

      const publicaciones = await getPublicationByMarcaAction(marcaGlobalSeleccionada?._id);
      console.log("publicaciones", publicaciones);

      if (publicaciones.isOk) {

        const calendarEvents: IEventCalendar[] = publicaciones?.data?.map((p) => {
          return {
            id: p._id,
            // label: p.socialMedia.map(s=>labelsProviderToColor[s.provider]).join(",")  ?? "", //TODOS LOS LABELS
            label: labelsProviderToColor[p.socialMedia[0].provider] ?? "gray", //SOLO EL PRIMERO
            ...p
          }
        }) ?? [];

        console.log("calendarEvents", calendarEvents);
        console.log("calendarEvents", calendarEvents.length);

        calendarEvents.forEach((evt) => {
          // if (savedEvents.find((e) => e.id !== evt.id)) 
          dispatchCalEvent({ type: "push", payload: evt });
        });

      }


    };

    //Actualizar los eventos del calendario 
    updatePublicacionesFromDatabase();




  }, [marcaGlobalSeleccionada]);



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
