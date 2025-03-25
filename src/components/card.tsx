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
      className="grid h-[250px] w-[250px] items-end justify-center rounded-xl bg-bgPrimary shadow-lg hover:scale-105 ease-in duration-200"
    >
      <Link
        href={href}
        className="grid items-center justify-center text-center"
      >
        <div className="flex justify-center">
          <div className="grid h-[87px] w-[87px] items-center justify-center rounded-full bg-bgSecondary">
            {imgSrc ? <img src={imgSrc} alt={title} /> : icon}
          </div>
        </div>
        <p className="mt-2 text-[22px] font-semibold">{title}</p>
        <div className="mt-4 flex items-end rounded-xl">
          <div className="flex h-[80px] w-[250px] items-center rounded-b-xl bg-bgPrimary px-2.5 text-start text-[13px] font-semibold text-secondary">
            <p>{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
