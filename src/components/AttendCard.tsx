/* eslint-disable @next/next/no-img-element */
"use client";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

interface CardProps {
  href: string;
  imgSrc?: string;
  icon?: ReactNode;
  title: string;
  description: string;
  number: number;
}
const AttendCard: React.FC<CardProps> = ({
  href,
  imgSrc,
  icon,
  title,
  description,
  number,
}) => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <Link href={href} className="flex items-center justify-center text-center">
      <div className="grid h-[180px] w-full max-w-[300px] items-center justify-center rounded-xl bg-bgPrimary px-3 py-2 shadow-lg transition-shadow dark:shadow-[0_5px_20px_rgba(255,255,255,0.25)]">
        <div className="flex items-center justify-between gap-5">
          <div className="grid items-center justify-center gap-2 text-start">
            <p className="mt-2 text-[17px] font-semibold text-secondary">
              {title}
            </p>
            <p className="text-[22px] font-bold text-textPrimary">{number}</p>
            <p className="text-sm font-semibold">
              <span className="text-red-700">{description}</span>{" "}
              {currentLanguage === "en"
                ? "Absence today"
                : currentLanguage === "ar"
                  ? "غياب اليوم"
                  : currentLanguage === "fr"
                    ? "Absents aujourd’hui"
                    : "Absence today"}
            </p>
          </div>
          <div className="grid h-[50px] w-[50px] items-center justify-center rounded-full bg-attendance">
            {imgSrc ? <img src={imgSrc} alt={title} /> : icon}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AttendCard;
