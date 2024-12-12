"use client";
import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  addDays,
  parseISO,
} from "date-fns";
import Link from "next/link";

interface Meeting {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isAttendee: boolean;
}

interface TimelineProps {
  meetings: Meeting[];
  handleDelete: (id: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ meetings, handleDelete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [open, setOpen] = useState<number | boolean | null>(false);
  const toggleNavbar = (index: number) => {
    setOpen(open === index ? null : index);
  };
  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);
  const startOfFirstWeek = startOfWeek(startOfCurrentMonth, {
    weekStartsOn: 6,
  }); // week starts on Saturday
  const daysInMonth = eachDayOfInterval({
    start: startOfFirstWeek,
    end: addDays(endOfCurrentMonth, 6 - endOfCurrentMonth.getDay()),
  });

  const handlePrevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className="grid overflow-auto">
      <div className="mx-auto w-full overflow-auto">
        <div className="wrapper w-full overflow-auto rounded bg-bgPrimary shadow">
          <div className="header flex w-full justify-between border-b border-borderPrimary p-2 max-[1500px]:w-[1185px]">
            <button onClick={handlePrevMonth} className="p-2">
              <svg
                className="h-6 w-6"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <polyline points="15 6 9 12 15 18" />
              </svg>
            </button>
            <span className="text-lg font-bold">
              {format(currentMonth, "yyyy MMMM")}
            </span>
            <button onClick={handleNextMonth} className="p-2">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
          <table className="w-full overflow-auto">
            <thead>
              <tr>
                {[
                  "Saturday",
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ].map(day => (
                  <th
                    key={day}
                    className="h-10 w-40 border-r border-borderPrimary p-2 text-xs xl:text-sm"
                  >
                    <span className="hidden sm:block md:block lg:block xl:block">
                      {day}
                    </span>
                    <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                      {day.slice(0, 3)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.ceil(daysInMonth.length / 7) }).map(
                (_, weekIndex) => (
                  <tr key={weekIndex} className="h-20 text-center">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const day = daysInMonth[weekIndex * 7 + dayIndex];
                      return (
                        <td
                          key={dayIndex}
                          className={`ease h-40 w-40 cursor-pointer overflow-auto border border-borderPrimary p-1 transition duration-500 hover:bg-bgSecondary ${
                            !isSameMonth(day, currentMonth)
                              ? "bg-bgSecondary"
                              : ""
                          } ${
                            isToday(day)
                              ? "scale-90 bg-blue-300 shadow-2xl"
                              : ""
                          }`}
                        >
                          {day && (
                            <div className="mx-auto flex h-40 w-40 flex-col overflow-hidden">
                              <div className="top h-5 w-full">
                                <span className="text-gray-500">
                                  {format(day, "d")}
                                </span>
                              </div>
                              <div className="bottom h-30 w-full flex-grow cursor-pointer overflow-auto py-1">
                                {meetings
                                  .filter(
                                    meeting =>
                                      format(
                                        parseISO(meeting.startDate),
                                        "yyyy-MM-dd",
                                      ) === format(day, "yyyy-MM-dd"),
                                  )
                                  .map((meeting, index) => (
                                    <div
                                      key={meeting.id}
                                      className="event mb-1 flex flex-col justify-center gap-1 rounded bg-primary px-3 py-1.5 text-center text-sm text-white"
                                    >
                                      {/*  */}
                                      <div className="flex items-start justify-end gap-2">
                                        <div className="flex h-[35px] items-center gap-2">
                                          <button
                                            onClick={() =>
                                              handleDelete(meeting.id)
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
                                            href={`/educational-affairs/events/${meeting.id}`}
                                          >
                                            <svg
                                              className="h-6 w-6 text-white"
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
                                      {/*  */}
                                      <span className="event-name text-[18px] font-semibold">
                                        {meeting.title}
                                      </span>
                                      {/* <span className="description">
                                        {meeting.description}
                                      </span> */}
                                      <span className="time">
                                        {format(
                                          parseISO(meeting.startDate),
                                          "hh:mm a",
                                        )}{" "}
                                        -{" "}
                                        {format(
                                          parseISO(meeting.endDate),
                                          "hh:mm a",
                                        )}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
