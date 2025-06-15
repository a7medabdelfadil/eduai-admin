"use client";
import React, { useState, useRef, useEffect } from "react";
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

interface DropdownPosition {
  top: number;
  right: number;
}

const Timeline: React.FC<TimelineProps> = ({ meetings, handleDelete }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTriggerRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Function to check if dropdown should flip direction
  const calculateDropdownPosition = (
    buttonElement: HTMLElement,
  ): DropdownPosition => {
    const rect = buttonElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceRight = window.innerWidth - rect.right;

    // Default position (below and to the right)
    let position: DropdownPosition = {
      top: rect.height,
      right: 0,
    };

    // If not enough space below, position above
    if (spaceBelow < 200) {
      position.top = -200; // Approximate dropdown height
    }

    // If not enough space to the right, position to the left
    if (spaceRight < 200) {
      position.right = rect.width - 200; // Approximate dropdown width
    }

    return position;
  };

  const toggleDropdown = (meetingId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    // If this dropdown is already open, close it
    if (activeDropdown === meetingId) {
      setActiveDropdown(null);
      setDropdownPosition(null);
      return;
    }

    // Get the button element that was clicked
    const buttonElement = dropdownTriggerRefs.current.get(meetingId);
    if (buttonElement) {
      const position = calculateDropdownPosition(buttonElement);
      setDropdownPosition(position);
      setActiveDropdown(meetingId);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Check if the click was on a trigger button
        const isOnTrigger = Array.from(
          dropdownTriggerRefs.current.values(),
        ).some(button => button.contains(event.target as Node));

        if (!isOnTrigger) {
          setActiveDropdown(null);
          setDropdownPosition(null);
        }
      }
    };

    const handleScroll = () => {
      if (activeDropdown !== null) {
        const buttonElement = dropdownTriggerRefs.current.get(activeDropdown);
        if (buttonElement) {
          const position = calculateDropdownPosition(buttonElement);
          setDropdownPosition(position);
        }
      }
    };

    const handleResize = () => {
      if (activeDropdown !== null) {
        const buttonElement = dropdownTriggerRefs.current.get(activeDropdown);
        if (buttonElement) {
          const position = calculateDropdownPosition(buttonElement);
          setDropdownPosition(position);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeDropdown]);

  // Reset dropdown position when active dropdown changes
  useEffect(() => {
    if (activeDropdown === null) {
      setDropdownPosition(null);
    }
  }, [activeDropdown]);

  const startOfCurrentMonth = startOfMonth(currentMonth);
  const endOfCurrentMonth = endOfMonth(currentMonth);
  const startOfFirstWeek = startOfWeek(startOfCurrentMonth, {
    weekStartsOn: 6,
  });
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
                <path stroke="none" d="M0 0h24v24H0z" />
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
                                  .map(meeting => (
                                    <div
                                      key={meeting.id}
                                      className="event mb-1 flex flex-col justify-center gap-1 rounded bg-primary px-3 py-1.5 text-center text-sm text-white"
                                    >
                                      <div className="flex items-start justify-end">
                                        <div className="relative">
                                          <button
                                            ref={el => {
                                              if (el) {
                                                dropdownTriggerRefs.current.set(
                                                  meeting.id,
                                                  el,
                                                );
                                              }
                                            }}
                                            onClick={e =>
                                              toggleDropdown(meeting.id, e)
                                            }
                                            className="rounded-full p-1 transition-colors hover:bg-white/10"
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

                                          {activeDropdown === meeting.id &&
                                            dropdownPosition && (
                                              <div
                                                ref={dropdownRef}
                                                style={{
                                                  top: `${dropdownPosition.top}px`,
                                                  right: `${dropdownPosition.right}px`,
                                                }}
                                                className="absolute z-50 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                                              >
                                                <div className="py-1">
                                                  <Link
                                                    href={`/educational-affairs/events/${meeting.id}`}
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
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
                                                      <line
                                                        x1="16"
                                                        y1="5"
                                                        x2="19"
                                                        y2="8"
                                                      />
                                                    </svg>
                                                  </Link>
                                                  <button
                                                    onClick={e => {
                                                      e.stopPropagation();
                                                      handleDelete(meeting.id);
                                                      setActiveDropdown(null);
                                                    }}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-error transition-colors hover:bg-gray-100"
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
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </div>
                                      <span className="event-name text-[18px] font-semibold">
                                        {meeting.title}
                                      </span>
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
