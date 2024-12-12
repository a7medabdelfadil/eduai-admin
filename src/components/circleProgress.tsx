/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface CircleProgressProps {
  percentage: number;
}
const CircleProgress: React.FC<CircleProgressProps> = ({ percentage }) => {
  const [progress, setProgress] = useState(0);
  const { theme } = useTheme(); // Get the current theme (light or dark)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress =>
        prevProgress < percentage ? prevProgress + 1 : percentage,
      );
    }, 40);

    return () => clearInterval(interval);
  }, [percentage]);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Determine the text color based on the current theme
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <>
      <div className="grid h-[300px] w-[300px] items-center justify-center">
        <svg className="h-[250px] w-[250px]" viewBox="0 0 50 50">
          <circle
            className="stroke-current text-secondary"
            stroke="#ddd"
            strokeWidth="7"
            fill="transparent"
            r={radius}
            cx="25"
            cy="25"
          />
          <circle
            className="stroke-current text-blue-500 duration-100 ease-linear"
            stroke="#3b82f6"
            strokeWidth="7"
            fill="transparent"
            r={radius}
            cx="25"
            cy="25"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
          <text
            x="50%"
            y="46%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="items-center text-center text-xs font-semibold"
            fill={textColor} // Change the fill property based on the theme
          >
            {progress}
          </text>
          <text
            x="50%"
            y="70%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="items-center text-[5px] font-semibold"
            fill={textColor} // Change the fill property based on the theme
          >
            {100 - progress}
          </text>
        </svg>
      </div>
    </>
  );
};

export default CircleProgress;
