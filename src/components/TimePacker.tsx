import { useState } from "react";

const TimePicker: React.FC = () => {
  const [hour, setHour] = useState(8); // default to 8
  const [minute, setMinute] = useState(0); // default to 0
  const [isAM, setIsAM] = useState(true); // default to AM

  const handleHourChange = (value: number) => {
    if (value > 12) value = 1;
    if (value < 1) value = 12;
    setHour(value);
  };

  const handleMinuteChange = (value: number) => {
    if (value > 59) value = 0;
    if (value < 0) value = 59;
    setMinute(value);
  };

  const toggleAMPM = () => {
    setIsAM(prevIsAM => !prevIsAM);
  };

  const handleScroll = (
    event: React.WheelEvent<HTMLInputElement>,
    type: "hour" | "minute",
  ) => {
    if (type === "hour") {
      handleHourChange(hour + (event.deltaY < 0 ? 1 : -1));
    } else {
      handleMinuteChange(minute + (event.deltaY < 0 ? 1 : -1));
    }
  };

  return (
    <div className="inline-block rounded-lg bg-gray-800 p-4">
      <div className="flex items-center justify-center space-x-4">
        <div className="flex flex-col items-center">
          <input
            type="number"
            value={hour.toString().padStart(2, "0")}
            onChange={e => handleHourChange(Number(e.target.value))}
            onWheel={e => handleScroll(e, "hour")}
            className="bg-primary-dark w-20 rounded-md text-center text-3xl focus:outline-none"
            min={1}
            max={12}
          />
        </div>
        <span className="text-3xl">:</span>
        <div className="flex flex-col items-center">
          <input
            type="number"
            value={minute.toString().padStart(2, "0")}
            onChange={e => handleMinuteChange(Number(e.target.value))}
            onWheel={e => handleScroll(e, "minute")}
            className="bg-primary-dark w-20 rounded-md text-center text-3xl focus:outline-none"
            min={0}
            max={59}
          />
        </div>
        <div className="ml-6 flex flex-col space-y-2">
          <button
            onClick={toggleAMPM}
            className={`rounded-md px-4 py-2 text-lg ${
              isAM ? "bg-blue-500" : "bg-primary-dark hover:bg-gray-600"
            }`}
          >
            AM
          </button>
          <button
            onClick={toggleAMPM}
            className={`rounded-md px-4 py-2 text-lg ${
              !isAM ? "bg-blue-500" : "bg-primary-dark hover:bg-gray-600"
            }`}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimePicker;
