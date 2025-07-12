"use client";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useSelector } from "react-redux";

interface Schedule {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  courseName: string;
  classroomName: string;
}

const staticDays = [
  { id: 1, name: "Sat" },
  { id: 2, name: "Sun" },
  { id: 3, name: "Mon" },
  { id: 4, name: "Tue" },
  { id: 5, name: "Wed" },
  { id: 6, name: "Thu" },
  { id: 7, name: "Fri" },
];

const timeSlots = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];


const isTimeInRange = (time: string): boolean => {
  const [hours, minutes] = time.split(":").map(Number);
  const timeInMinutes = hours * 60 + minutes;
  const startInMinutes = 7 * 60; // 07:00
  const endInMinutes = 16 * 60; // 16:00
  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
};

const timeToPosition = (time: string): number => {
  const [hour, minute] = time.split(":").map(Number);
  const totalMinutes = hour * 60 + minute;
  const startOfDay = 7 * 60; // 07:00
  const minutesSinceStartOfDay = totalMinutes - startOfDay;
  return (minutesSinceStartOfDay / 540) * 100; // 540 minutes = 9 hours (07:00 to 16:00)
};

const calculateHeight = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const startInMinutes = startHour * 60 + startMinute;
  const endInMinutes = endHour * 60 + endMinute;
  const durationInMinutes = endInMinutes - startInMinutes;
  return (durationInMinutes / 540) * 100; // 540 minutes = 9 hours
};

const TimeTable = ({
  scheduleData,
  handleDelete,
}: {
  scheduleData: Schedule[];
  handleDelete: (id: number) => void;
}) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpenId !== null) {
        const dropdownRef = dropdownRefs.current[dropdownOpenId];
        const buttonRef = buttonRefs.current[dropdownOpenId];

        if (
          dropdownRef &&
          buttonRef &&
          !dropdownRef.contains(event.target as Node) &&
          !buttonRef.contains(event.target as Node)
        ) {
          setDropdownOpenId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpenId]);

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
  };

  const findOverlappingEvents = (
    currentEvent: Schedule,
    dayEvents: Schedule[],
  ) => {
    return dayEvents.filter(
      event =>
        event.id !== currentEvent.id &&
        ((event.startTime >= currentEvent.startTime &&
          event.startTime < currentEvent.endTime) ||
          (event.endTime > currentEvent.startTime &&
            event.endTime <= currentEvent.endTime) ||
          (event.startTime <= currentEvent.startTime &&
            event.endTime >= currentEvent.endTime)),
    );
  };

  const isEventVisible = (event: Schedule): boolean => {
    return isTimeInRange(event.startTime) && isTimeInRange(event.endTime);
  };

  return (
    <div
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      className="mb-20 grid w-full overflow-x-auto"
    >
      <div className="grid w-full overflow-x-auto">
        <div
          className={`mx-3 rounded-xl bg-bgPrimary p-6 ${booleanValue ? "w-[1750px]" : "w-[1570px]"} overflow-hidden`}
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
          <div className="relative mt-4 flex h-[1250px]">
            {/* Time labels */}
            <div className="flex flex-col">
              {timeSlots.map((time, idx) => (
                <div
                  key={idx}
                  className={`h-[125px] pr-4 text-right font-medium ${time == "08:00" ? "-translate-y-1" : time == "07:00" ? "-translate-y-2" : time == "10:00" ? "translate-y-1" : time == "11:00" ? "translate-y-2" : time == "12:00" ? "translate-y-4" : time == "13:00" ? "translate-y-6" : time == "14:00" ? "translate-y-7" : time == "15:00" ? "translate-y-8" : time == "16:00" ? "translate-y-9" : ""}`}
                >
                  {time}
                </div>
              ))}
            </div>

            {/* Grid and events container */}
            <div className="relative flex flex-1">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0">
                {timeSlots.map((_, idx) => (
                  <div
                    key={idx}
                    className="absolute w-full border-t border-borderPrimary"
                    style={{ top: `${(idx * 100) / (timeSlots.length - 1)}%` }}
                  />
                ))}
              </div>

              {/* Days columns with events */}
              {staticDays.map(day => {
                const dayEvents = scheduleData.filter(event =>
                  event.day.toUpperCase().startsWith(day.name.toUpperCase()),
                );

                return (
                  <div
                    key={day.id}
                    className="relative flex-1 border-l border-borderPrimary"
                  >
                    {dayEvents.filter(isEventVisible).map(event => {
                      const top = timeToPosition(event.startTime);
                      const height = calculateHeight(
                        event.startTime,
                        event.endTime,
                      );
                      const [startHour, startMinute] = event.startTime.split(":").slice(0, 2).map(Number);
                      const [endHour, endMinute] = event.endTime.split(":").slice(0, 2).map(Number);
                      const start = startHour * 60 + startMinute;
                      const end = endHour * 60 + endMinute;
                      const duration = end - start;

                      let fontSize = "text-sm";
                      if (duration >= 60) fontSize = "text-xl";
                      else if (duration >= 40) fontSize = "text-lg";
                      else if (duration >= 25) fontSize = "text-base";


                      const overlappingEvents = findOverlappingEvents(
                        event,
                        dayEvents.filter(isEventVisible),
                      );
                      const hasOverlap = overlappingEvents.length > 0;

                      return (
                        <React.Fragment key={event.id}>
                          <div
                            className={`absolute left-0 right-0 overflow-hidden rounded-lg border-l-4 border-primary bg-thead ${duration >= 40 ? "p-4" : "p-2"} text-primary shadow-lg transition-all duration-200 ${hasOverlap ? "hover:z-40 hover:scale-105" : ""
                              } ${hoveredEvent === event.id ? "z-50 scale-105" : ""}`}
                            style={{
                              top: `${top}%`,
                              height: `${height}%`,
                              opacity:
                                hoveredEvent === null ||
                                  hoveredEvent === event.id
                                  ? 1
                                  : 0.5,
                            }}
                            onMouseEnter={() => setHoveredEvent(event.id)}
                            onMouseLeave={() => setHoveredEvent(null)}
                          >
                            <div className="relative flex items-start justify-end gap-2">
                              <div className="absolute -right-2 -top-0 flex items-center gap-2">
                                <button
                                  ref={el => {
                                    buttonRefs.current[event.id] = el;
                                  }}
                                  onClick={() => toggleDropdown(event.id)}
                                >
                                  <svg
                                    className="h-6 w-6"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="12" cy="5" r="1" />
                                    <circle cx="12" cy="19" r="1" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="mb-1 flex flex-col items-start leading-tight">
                              <span className={`font-semibold ${fontSize} truncate w-full`}>
                                {event.courseName}
                              </span>

                              <span
                                className={`flex items-center gap-1 ${duration >= 60 ? "text-sm" : duration >= 40 ? "text-xs" : "text-[10px]"
                                  }`}
                              >
                                <AiOutlineClockCircle /> {event.startTime.slice(0, 5)} - {event.endTime.slice(0, 5)}
                              </span>

                              <span
                                className={`flex items-center gap-1 ${duration >= 60 ? "text-sm" : duration >= 40 ? "text-xs" : "text-[10px]"
                                  }`}
                              >
                                <FaChalkboardTeacher /> {event.classroomName}
                              </span>
                            </div>

                            {hasOverlap && hoveredEvent === event.id && (
                              <div className="absolute left-full top-0 mt-2 w-48 rounded-lg bg-bgPrimary p-2 shadow-lg">
                                <div className="text-sm font-semibold">
                                  Overlapping Schedules:
                                </div>
                                {overlappingEvents.map(overlap => (
                                  <div
                                    key={overlap.id}
                                    className="mt-1 text-xs"
                                  >
                                    <div>{overlap.courseName}</div>
                                    <div>{`${overlap.startTime} - ${overlap.endTime}`}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {dropdownOpenId === event.id && (
                            <div
                              ref={el => {
                                dropdownRefs.current[event.id] = el;
                              }}
                              className="absolute right-9 z-50 w-14 rounded-md bg-bgPrimary shadow-lg"
                              style={{ top: `${top - 5}%` }}
                            >
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="block w-full px-4 py-2 text-left text-red-600"
                              >
                                <svg
                                  className="mr-2 h-5 w-5"
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
                                className="block w-full px-4 py-2 text-left"
                              >
                                <svg
                                  className="mr-2 h-5 w-5"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                  <line x1="16" y1="5" x2="19" y2="8" />
                                </svg>
                              </Link>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
