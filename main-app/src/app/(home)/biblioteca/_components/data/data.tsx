// File: data.tsx
import { ArrowDown, ArrowRight, ArrowUp, CheckCheck, Circle, CircleX, FileQuestion, Image, Timer, VideoIcon } from "lucide-react"



export const types = [
  {
    value: "image",
    label: "Imagenes",
    icon: Image,
  },
  {
    value: "video",
    label: "Videos",
    icon: VideoIcon,
  },
]






export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
]

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: FileQuestion,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCheck,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleX,
  },
]

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
]
