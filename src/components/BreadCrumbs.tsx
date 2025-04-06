"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  nameEn: string;
  nameAr: string;
  nameFr: string;
  href: string;
}

interface BreadCrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ breadcrumbs }) => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const pathname = usePathname();

  return (
    <div
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      className={`flex items-center gap-2 ${
        currentLanguage === "ar"
          ? booleanValue
            ? "lg:mr-[100px]"
            : "lg:mr-[270px]"
          : booleanValue
            ? "lg:ml-[100px]"
            : "lg:ml-[270px]"
      } m-5 flex-wrap text-[18px] max-[550px]:text-[15px]`}
    >
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          <Link
            className={`font-semibold transition-all duration-300 ease-in-out ${
              pathname === crumb.href
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            } p-1`}
            href={crumb.href}
            style={{ margin: "0 5px" }} // Padding for better spacing
          >
            {currentLanguage === "en"
              ? crumb.nameEn
              : currentLanguage === "ar"
                ? crumb.nameAr
                : crumb.nameFr}
          </Link>
          {index < breadcrumbs.length - 1 &&
            (currentLanguage === "ar" ? (
              <MdNavigateBefore size={25} className="text-gray-400" />
            ) : (
              <MdNavigateNext size={25} className="text-gray-400" />
            ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default BreadCrumbs;
