/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
interface DynamicPartitionProps {
  percentage: number;
}
const DynamicPartition: React.FC<DynamicPartitionProps> = ({ percentage }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {}, [percentage]);
  const days = (percentage / 14) * 100;
  const angle = days * 3.6;
  return (
    <>
      <div className="relative h-[250px] w-[250px]">
        {/* Full circle background */}
        <div className="absolute h-full w-full rounded-full bg-secondary"></div>

        {/* Dynamic partition */}
        <div
          className="clip-circle absolute h-full w-full rounded-full"
          style={{
            backgroundImage: `conic-gradient(primary ${angle}deg, transparent 0deg)`,
          }}
        ></div>
      </div>
    </>
  );
};

export default DynamicPartition;
