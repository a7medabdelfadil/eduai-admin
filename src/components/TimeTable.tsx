"use client";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const staticDays = [
  { id: 1, name: "Sat" },
  { id: 2, name: "Sun" },
  { id: 3, name: "Mon" },
  { id: 4, name: "Tue" },
  { id: 5, name: "Wed" },
  { id: 6, name: "Thu" },
  { id: 7, name: "Fri" },
];

const timeToPosition = (time: {
  split: (arg0: string) => {
    (): any;
    new(): any;
    map: { (arg0: NumberConstructor): [any, any]; new(): any };
  };
}) => {
  const [hour, minute] = time.split(":").map(Number);

  const totalMinutes = hour * 60 + minute;
  const startOfDay = 7 * 60;
  const minutesSinceStartOfDay = totalMinutes - startOfDay;

  return (minutesSinceStartOfDay / 540) * 100;
};

const calculateHeight = (
  startTime: {
    split: (arg0: string) => {
      (): any;
      new(): any;
      map: { (arg0: NumberConstructor): [any, any]; new(): any };
    };
  },
  endTime: {
    split: (arg0: string) => {
      (): any;
      new(): any;
      map: { (arg0: NumberConstructor): [any, any]; new(): any };
    };
  },
) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;

  const durationInMinutes = endInMinutes - startInMinutes;

  return (durationInMinutes / 540) * 100;
};

const TimeTable = ({ scheduleData, handleDelete }: { scheduleData: any[], handleDelete: (id: number) => void; }) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );
  return (
    <div
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      className="mb-20 grid w-full overflow-x-auto"
    >
      <div className="grid w-full overflow-x-auto">
        <div
          className={`mx-3 rounded-xl bg-bgPrimary p-6 ${booleanValue ? "w-[1750px]" : "w-[1570px]"}`}
        >
          {/* Day headers */}
          <div className="flex justify-between">
            <div className="w-1/12"></div>
            {staticDays.map(day => (
              <div
                key={day.id}
                className="w-20 -translate-x-[85px] rounded-lg border border-borderPrimary px-4 py-2 text-center shadow-lg"
              >
                <div className="font-semibold">{day.name}</div>
              </div>
            ))}
          </div>

          {/* Time slots and events */}
          <div className="relative mt-4 flex h-[540px]">
            <div className="flex flex-col">
              {[
                "07:00 AM",
                "08:00 AM",
                "09:00 AM",
                "10:00 AM",
                "11:00 AM",
                "12:00 PM",
                "01:00 PM",
                "02:00 PM",
                "03:00 PM",
                "04:00 PM",
              ].map((time, idx) => (
                <div
                  key={idx}
                  className="mt-1 h-[60px] border-b-2 border-dashed border-borderPrimary py-2 pr-4 text-right"
                >
                  {time}
                </div>
              ))}
            </div>
            {/* Events for each day */}
            {staticDays.map(day => (
              <div
                key={day.id}
                className="relative flex-1 border-l border-borderPrimary"
              >
                {scheduleData
                  .filter(event =>
                    event.day.toUpperCase().startsWith(day.name.toUpperCase()),
                  )
                  .map((event, idx) => {
                    const top = timeToPosition(event.startTime);
                    const height = calculateHeight(
                      event.startTime,
                      event.endTime,
                    );
                    return (
                      <div
                        key={idx}
                        className="border-borderPrimary-4 absolute left-0 right-0 mx-2 overflow-auto rounded-lg border-l border-primary bg-thead p-4 text-primary"
                        style={{ top: `${top}%`, height: `${height}%` }}
                      >
                        <div className="flex items-start justify-end gap-2 relative">
                          <div className="flex items-center gap-2 absolute -top-2 -right-2">
                            <button
                            onClick={() =>
                              handleDelete(event.id)
                            }
                            >
                              <svg
                                className="h-6 w-6 text-error"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                            <Link
                              href={`/educational-affairs/schedule/${event.id}`}
                            >
                              <svg
                                className="h-6 w-6 "
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                {" "}
                                <path
                                  stroke="none"
                                  d="M0 0h24v24H0z"
                                />{" "}
                                <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
                                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
                                <line
                                  x1="16"
                                  y1="5"
                                  x2="19"
                                  y2="8"
                                />
                              </svg>
                            </Link>
                          </div>
                        </div>
                        <div className="font-bold">{event.courseName}</div>
                        <div className="text-sm">{`${event.startTime} - ${event.endTime}`}</div>
                        <div className="text-xs">{event.classroomName}</div>
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
