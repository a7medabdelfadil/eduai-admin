/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

interface CardProps {
  href: string;
  icon?: ReactNode;
  imgSrc?: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({
  href,
  icon,
  title,
  imgSrc,
  description,
}) => {
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <div
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      className="h-[250px] w-[300px] overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-200 ease-in hover:scale-105"
    >
      <Link href={href} className="flex h-full flex-col justify-between">
        <div className="mt-6 flex flex-col items-center justify-center pt-6">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-bgRowTable">
            {imgSrc ? (
              <img src={imgSrc} alt={title} className="h-[30px] w-[30px]" />
            ) : (
              icon
            )}
          </div>
          <p className="mt-3 text-center text-[22px] font-semibold text-textPrimary">
            {title}
          </p>
        </div>

        <div className="flex h-[60px] items-center justify-between bg-bgRowTable px-4 text-[13px] font-medium text-secondary">
          <p>{description}</p>
          <span className="text-xl">&rsaquo;</span>
        </div>
      </Link>
    </div>
  );
};

export default Card;
