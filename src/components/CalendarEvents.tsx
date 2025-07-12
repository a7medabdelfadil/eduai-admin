"use client";

import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  meetings?: { startDate: string }[];
}

const CalendarEvents: React.FC<CalendarProps> = ({
  onDateSelect,
  initialDate = new Date(),
  meetings = [],
}) => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const [selectedDate, setSelectedDate] = React.useState(initialDate);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const generateMonthDates = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }

    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      days.unshift(null);
    }

    return days;
  };

  const monthDates = generateMonthDates();

  const goToPreviousMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setSelectedDate(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1),
    );
  };

  const monthYear = format(selectedDate, "LLLL yyyy", { locale: enUS });

  const meetingDatesSet = new Set(
    meetings.map((m) => new Date(m.startDate).toDateString())
  );

  return (
    <div className="calendar-component">
      <div className="grid h-[450px] w-[500px] rounded-xl bg-bgPrimary p-5 max-[1342px]:w-full">
        <div className="mb-7 flex items-center justify-between">
          <button
            aria-label="Previous month"
            className="rounded-lg border border-borderPrimary p-2 text-[23px] font-semibold text-primary"
            onClick={goToPreviousMonth}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>
          <h2 aria-live="polite" className="mb-3 font-semibold text-textSecondary">
            {monthYear}
          </h2>
          <button
            aria-label="Next month"
            className="rounded-lg border border-borderPrimary p-2 text-[23px] font-semibold text-primary"
            onClick={goToNextMonth}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-8" role="row">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
            <div key={day} role="columnheader" className="font-medium text-textSecondary">
              {currentLanguage === "ar"
                ? day === "SUN"
                  ? "الأحد"
                  : day === "MON"
                    ? "الإثنين"
                    : day === "TUE"
                      ? "الثلاثاء"
                      : day === "WED"
                        ? "الأربعاء"
                        : day === "THU"
                          ? "الخميس"
                          : day === "FRI"
                            ? "الجمعة"
                            : "السبت"
                : currentLanguage === "fr"
                  ? day === "SUN"
                    ? "DIM"
                    : day === "MON"
                      ? "LUN"
                      : day === "TUE"
                        ? "MAR"
                        : day === "WED"
                          ? "MER"
                          : day === "THU"
                            ? "JEU"
                            : day === "FRI"
                              ? "VEN"
                              : "SAM"
                  : day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-x-7" role="grid">
          {monthDates.map((date, index) => {
            const hasMeeting = date && meetingDatesSet.has(date.toDateString());
            return (
              <div
                key={index}
                role="gridcell"
                tabIndex={date ? 0 : -1}
                aria-selected={
                  date && date.getDate() === selectedDate.getDate()
                    ? "true"
                    : "false"
                }
                aria-label={date ? format(date, "MMMM d, yyyy") : ""}
                className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-semibold text-textSecondary ${
                  date ? "hover:bg-thead focus:bg-primary" : ""
                } ${
                  date && date.getDate() === selectedDate.getDate()
                    ? "bg-primary text-white"
                    : ""
                }`}
                onClick={() => date && handleDateClick(date)}
              >
                {date ? date.getDate() : ""}
                {hasMeeting && <span className="absolute bottom-0 h-1 w-1 rounded-full bg-primary" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarEvents;
