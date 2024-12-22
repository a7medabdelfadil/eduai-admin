"use client";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
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
    new (): any;
    map: { (arg0: NumberConstructor): [any, any]; new (): any };
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
      new (): any;
      map: { (arg0: NumberConstructor): [any, any]; new (): any };
    };
  },
  endTime: {
    split: (arg0: string) => {
      (): any;
      new (): any;
      map: { (arg0: NumberConstructor): [any, any]; new (): any };
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

const TimeTable = ({
  scheduleData,
  handleDelete,
}: {
  scheduleData: any[];
  handleDelete: (id: number) => void;
}) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );
  const [dropdownOpenId, setDropdownOpenId] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside all open dropdowns
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

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpenId]);

  const toggleDropdown = (id: number) => {
    setDropdownOpenId(dropdownOpenId === id ? null : id);
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
                      <React.Fragment key={event.id}>
                        <div
                          className="border-borderPrimary-4 absolute left-0 right-0 mx-2 overflow-auto rounded-lg border-l border-primary bg-thead p-4 text-primary shadow-lg"
                          style={{ top: `${top}%`, height: `${height}%` }}
                        >
                          <div className="relative flex items-start justify-end gap-2">
                            <div className="absolute -right-2 -top-2 flex items-center gap-2">
                              <div className="">
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
                          </div>
                          <div className="font-bold">{event.courseName}</div>
                          <div className="text-sm">{`${event.startTime} - ${event.endTime}`}</div>
                          <div className="text-xs">{event.classroomName}</div>
                        </div>
                        {dropdownOpenId === event.id && (
                          <div
                            ref={el => {
                              dropdownRefs.current[event.id] = el;
                            }}
                            className="absolute left-0 right-0 z-10 w-32 rounded-md bg-bgPrimary shadow-lg"
                            style={{ top: `${top - 5}%` }}
                          >
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="block w-full px-4 py-2 text-left text-red-600"
                            >
                              Delete
                            </button>
                            <Link
                              href={`/educational-affairs/schedule/${event.id}`}
                              className="block w-full px-4 py-2 text-left"
                            >
                              Edit
                            </Link>
                          </div>
                        )}
                      </React.Fragment>
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
