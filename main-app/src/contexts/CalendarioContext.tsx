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
  _id: string;
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
  dispatchCalEvent: Dispatch<ActionCustomReducer>;
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


// Define el tipo de acción
type ActionCustomReducer = 
  | { type: 'push'; payload: IEventCalendar | IEventCalendar[] }
  | { type: 'update'; payload: IEventCalendar }
  | { type: 'delete'; payload: IEventCalendar }
  | { type: 'reset'; payload: IEventCalendar[] };

// Reducer para manejar los eventos guardados
function savedEventsReducer(
  state: IEventCalendar[],
  action: ActionCustomReducer
): IEventCalendar[] {
  switch (action.type) {
    case 'push':
      return Array.isArray(action.payload) ? [...state, ...action.payload] : [...state, action.payload];
    case 'update':
      return state.map((evt) => (evt.id === action.payload.id ? action.payload : evt));
    case 'delete':
      return state.filter((evt) => evt.id !== action.payload.id);
    case 'reset':
      return action.payload; // Aquí se resetea el estado con el nuevo conjunto de eventos
    default:
      throw new Error('Unknown action type');
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
  const [selectedEvent, setSelectedEvent] = useLocalStorage<IEventCalendar | null>("selectedEvent", null);
  // const [selectedEvent, setSelectedEvent] = useState<IEventCalendar | null>(null);

  const [labels, setLabels] = useState<ILabelCalendar[]>([]);
  const [savedEvents, dispatchCalEvent] = useReducer(
    savedEventsReducer,
    [] as IEventCalendar[],
  );

  const filteredEvents = useMemo(() => {

    //Filtro los eventos que tengan al menos una red social seleccionada
    const filter = savedEvents.filter((evt: IEventCalendar) => {
      return labels.some((lbl) =>  evt.socialMedia.some(sm=>sm.socialMedia._id ==lbl._id) && lbl.checked) ?? false;
    });

    //Elimino los repetidos de _id
    var dataUnique: IEventCalendar[] = [];
    const unique = filter.map((event:IEventCalendar) =>{
      if(!dataUnique.some((e) => e._id === event._id))
        dataUnique.push(event);
    } );
    return dataUnique;

  }, [savedEvents, labels]);



  // LA MARCA global seleccionada cambia
  useEffect(() => {

    dispatchCalEvent({ type: "reset", payload: [] });

    if (!marcaGlobalSeleccionada) {
      return;
    }

    const labelsNuevos: ILabelCalendar[] = marcaGlobalSeleccionada?.socialMedia.map((redSocial) => {
      return {
        _id: redSocial._id,
        label: labelsProviderToColor[redSocial.provider] ?? "gray",
        checked: true,
        socialMedia: redSocial
      }
    }) ?? [];
    //label 
    setLabels(labelsNuevos);


    const updatePublicacionesFromDatabase = async () => {

      const publicaciones = await getPublicationByMarcaAction(marcaGlobalSeleccionada?._id);

      if (publicaciones.isOk) {

        const calendarEvents: IEventCalendar[] = publicaciones?.data?.map((p) => {
          return {
            id: p._id,
            // label: p.socialMedia.map(s=>labelsProviderToColor[s.provider]).join(",")  ?? "", //TODOS LOS LABELS
            label: labelsProviderToColor[p.socialMedia[0].provider] ?? "gray", //SOLO EL PRIMERO
            ...p
          }
        }) ?? [];

        calendarEvents.forEach((evt) => {
          dispatchCalEvent({ type: "push", payload: evt });
        });

        // dispatchCalEvent({ type: "reset", payload: calendarEvents });

      }


    };

    //Actualizar los eventos del calendario 
    updatePublicacionesFromDatabase();


    //Limpiar los estados de los archivos y redes sociales seleccionados
    setSelectedRedesSocialesList([]);
    setSelectedFileList([]);


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
    setCurrentMonthMatrix(getMonthDaysjs(monthIndex));
  }, [monthIndex]);

  function updateLabel(label: ILabelCalendar) {
    setLabels(labels.map((lbl) => (lbl._id === label._id ? label : lbl)));
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
