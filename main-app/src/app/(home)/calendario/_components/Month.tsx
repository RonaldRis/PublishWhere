"use client";
import React from "react";
import Day from "./Day";
import dayjs from "dayjs";
export default function Month({ month } : { month: dayjs.Dayjs[][] | undefined}) {
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-auto">
      {month?.map((row, i) => (
        <React.Fragment key={"M"+i}>
          {row.map((day, idx) => (
            <Day day={day} key={"D"+idx} rowIdx={i} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
