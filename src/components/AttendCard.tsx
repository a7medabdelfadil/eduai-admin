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
    <div className="grid h-[180px] w-[250px] items-center justify-center rounded-xl bg-bgPrimary px-3 py-2 shadow-lg">
      <Link
        href={href}
        className="flex items-center justify-center text-center"
      >
        <div className="flex items-center justify-between gap-5">
          <div className="grid items-center justify-center gap-2 text-start">
            <p className="mt-2 text-[17px] font-semibold text-secondary">
              {title}
            </p>
            <p className="font-semibold">{description}</p>
            <p className="font-semibold">
              <span className="font-semibold text-red-700">{number}</span>
              {currentLanguage === "en"
                ? " Present"
                : currentLanguage === "ar"
                  ? " حضور اليوم"
                  : currentLanguage === "fr"
                    ? "Présents Aujourd’hui"
                    : " Present today"}{" "}
              {/* Default to English */}
            </p>
          </div>
          <div className="grid h-[50px] w-[50px] items-center justify-center rounded-full bg-bgSecondary">
            {imgSrc ? <img src={imgSrc} alt={title} /> : icon}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AttendCard;
