import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function bytesToSize(bytes: number): string {

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes == 0) return '0 Byte';

  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));

  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export function bytesToMB(bytes: number): number {

 return Math.ceil(bytes / Math.pow(1024, 2));
}


export function getMonthDaysjs(month = dayjs().month()) {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
}
