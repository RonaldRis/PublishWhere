import dayjs from "dayjs";
import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
  Dispatch,
  ReactNode,
} from "react";

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
}

export interface ICalendarioContext {
  monthIndex: number;
  setMonthIndex: React.Dispatch<React.SetStateAction<number>>;
  smallCalendarMonth: number|null;
  setSmallCalendarMonth: React.Dispatch<React.SetStateAction<number|null>>;
  daySelected: dayjs.Dayjs | null;
  setDaySelected: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  showEventModal: boolean;
  setShowEventModal: React.Dispatch<React.SetStateAction<boolean>>;
  dispatchCalEvent: Dispatch<{ type: string; payload: any }>;
  savedEvents: IEventCalendar[];
  selectedEvent: IEventCalendar | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<IEventCalendar | null>>;
  labels: ILabelCalendar[];
  setLabels: React.Dispatch<React.SetStateAction<ILabelCalendar[]>>;
  updateLabel: (label: ILabelCalendar) => void;
  filteredEvents: IEventCalendar[];
}

const CalendarioContext = React.createContext<ICalendarioContext>({
  monthIndex: 0,
  setMonthIndex: () => {},
  smallCalendarMonth: 0,
  setSmallCalendarMonth: () => {},
  daySelected: null,
  setDaySelected: () => {},
  showEventModal: false,
  setShowEventModal: () => {},
  dispatchCalEvent: ({ type, payload }) => {},
  savedEvents: [],
  selectedEvent: null,
  setSelectedEvent: () => {},
  setLabels: () => {},
  labels: [],
  updateLabel: () => {},
  filteredEvents: [],
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
  const storageEvents = localStorage.getItem("savedEvents");
  const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
  return parsedEvents;
}

const CalendarioProvider = ({ children }: { children: ReactNode }) => {
  const [monthIndex, setMonthIndex] = useState<number>(dayjs().month());
  const [smallCalendarMonth, setSmallCalendarMonth] =
    useState<number|null>(null); //TODO: NO IDEA WHAT THIS IS
  const [daySelected, setDaySelected] = useState<dayjs.Dayjs>(dayjs());
  const [showEventModal, setShowEventModal] = useState(false);
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

  //TODO: REPASAR ESTO PARA QUE FUNCIONA O VER DONDE SE USA Y COMO
  useEffect(() => {
    setLabels((prevLabels) => {
      return [...new Set(savedEvents.map((evt) => evt.label))].map((label) => {
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
    if (!showEventModal) {
      setSelectedEvent(null);
    }
  }, [showEventModal]);

  function updateLabel(label: ILabelCalendar) {
    setLabels(labels.map((lbl) => (lbl.label === label.label ? label : lbl)));
  }

  return (
    <CalendarioContext.Provider
      value={{
        monthIndex,
        setMonthIndex,
        smallCalendarMonth,
        setSmallCalendarMonth,
        daySelected,
        setDaySelected,
        showEventModal,
        setShowEventModal,
        dispatchCalEvent,
        selectedEvent,
        setSelectedEvent,
        savedEvents,
        setLabels,
        labels,
        updateLabel,
        filteredEvents,
      }}
    >
      {children}
    </CalendarioContext.Provider>
  );
};

export { CalendarioProvider, CalendarioContext };
