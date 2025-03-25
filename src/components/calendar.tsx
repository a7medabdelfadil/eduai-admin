"use client";
import React from "react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ 
  onDateSelect,
  initialDate = new Date()
}) => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const [selectedDate, setSelectedDate] = React.useState(initialDate);

  // Function to handle date selection
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date); // Call the callback with selected date
  };

  // Rest of the calendar implementation remains the same
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

  return (
    <div className="calendar-component">
      <div className="grid h-[450px] w-[500px] rounded-xl bg-bgPrimary p-5 max-[1342px]:w-full">
        <div className="mb-7 flex items-center justify-between">
          <button
            aria-label="Previous month"
            className="rounded-lg border border-borderPrimary p-2 font-sans text-[23px] font-semibold text-primary"
            onClick={goToPreviousMonth}
          >
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
          <h2
            aria-live="polite"
            className="mb-3 font-sans font-semibold text-textSecondary"
          >
            {monthYear}
          </h2>
          <button
            aria-label="Next month"
            className="rounded-lg border border-borderPrimary p-2 font-sans text-[23px] font-semibold text-primary"
            onClick={goToNextMonth}
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 gap-8" role="row">
          {/* Day headers */}
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <div
              key={day}
              role="columnheader"
              className="font-sans font-medium text-textSecondary"
            >
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
          {monthDates.map((date, index) => (
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
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full font-semibold text-textSecondary ${
                date ? "hover:bg-thead focus:bg-primary" : ""
              } ${
                date && date.getDate() === selectedDate.getDate()
                  ? "bg-primary text-white"
                  : ""
              }`}
              onClick={() => date && handleDateClick(date)}
            >
              {date ? date.getDate() : ""}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
