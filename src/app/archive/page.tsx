"use client";
/* eslint-disable @next/next/no-img-element */
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaCar } from "react-icons/fa"; // Driver
import { FaUserTie } from "react-icons/fa"; // Employee
import { FaUserFriends } from "react-icons/fa"; // Parent
import { FaUserGraduate } from "react-icons/fa"; // Student
import { FaChalkboardTeacher } from "react-icons/fa"; // Teacher
import { FaTools } from "react-icons/fa"; // Worker
import { FaBus } from "react-icons/fa"; // Bus
import { FaBook } from "react-icons/fa"; // Library
import { FaDoorClosed } from "react-icons/fa"; // Room
import { FaClipboardList } from "react-icons/fa"; // Grades
import { FaBoxOpen } from "react-icons/fa"; // Resource
import { FaMoneyBillAlt } from "react-icons/fa"; // Fees
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const Archive = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Archive",
      nameAr: "الأرشيف",
      nameFr: "Archives",
      href: "/archive",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const items = [
    { href: "/archive/driver", icon: <FaCar size={40} />, key: "Driver" },
    {
      href: "/archive/employee",
      icon: <FaUserTie size={40} />,
      key: "Employee",
    },
    {
      href: "/archive/parent",
      icon: <FaUserFriends size={40} />,
      key: "Parent",
    },
    {
      href: "/archive/student",
      icon: <FaUserGraduate size={40} />,
      key: "Student",
    },
    {
      href: "/archive/teacher",
      icon: <FaChalkboardTeacher size={40} />,
      key: "Teacher",
    },
    { href: "/archive/worker", icon: <FaTools size={40} />, key: "Worker" },
    { href: "/archive/bus", icon: <FaBus size={40} />, key: "Bus" },
    { href: "/book", icon: <FaBook size={40} />, key: "Library" },
    { href: "/rooms", icon: <FaDoorClosed size={40} />, key: "Room" },
    {
      href: "/educational-affairs/grads",
      icon: <FaClipboardList size={40} />,
      key: "Grades",
    },
    {
      href: "/course/resource",
      icon: <FaBoxOpen size={40} />,
      key: "Resource",
    },
    {
      href: "/financial-management",
      icon: <FaMoneyBillAlt size={40} />,
      key: "Fees",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const getTranslatedText = (key: string) => {
    switch (key) {
      case "Driver":
        return currentLanguage === "en"
          ? "Driver"
          : currentLanguage === "ar"
            ? "السائقون"
            : currentLanguage === "fr"
              ? "Chauffeurs"
              : "Driver";
      case "Employee":
        return currentLanguage === "en"
          ? "Employee"
          : currentLanguage === "ar"
            ? "الموظفون"
            : currentLanguage === "fr"
              ? "Employés"
              : "Employee";
      case "Parent":
        return currentLanguage === "en"
          ? "Parent"
          : currentLanguage === "ar"
            ? "الاباء"
            : currentLanguage === "fr"
              ? "Parents"
              : "Parent";
      case "Student":
        return currentLanguage === "en"
          ? "Student"
          : currentLanguage === "ar"
            ? "الطلاب"
            : currentLanguage === "fr"
              ? "Étudiants"
              : "Student";
      case "Teacher":
        return currentLanguage === "en"
          ? "Teacher"
          : currentLanguage === "ar"
            ? "المعلمون"
            : currentLanguage === "fr"
              ? "Enseignants"
              : "Teacher";
      case "Worker":
        return currentLanguage === "en"
          ? "Worker"
          : currentLanguage === "ar"
            ? "العمال"
            : currentLanguage === "fr"
              ? "Travailleurs"
              : "Worker";
      case "Bus":
        return currentLanguage === "en"
          ? "Bus"
          : currentLanguage === "ar"
            ? "الحافلات"
            : currentLanguage === "fr"
              ? "Autobus"
              : "Bus";
      case "Library":
        return currentLanguage === "en"
          ? "Library"
          : currentLanguage === "ar"
            ? "المكتبات"
            : currentLanguage === "fr"
              ? "Bibliothèque"
              : "Library";
      case "Room":
        return currentLanguage === "en"
          ? "Room"
          : currentLanguage === "ar"
            ? "القاعات"
            : currentLanguage === "fr"
              ? "Salles"
              : "Room";
      case "Grades":
        return currentLanguage === "en"
          ? "Grades"
          : currentLanguage === "ar"
            ? "النقاط"
            : currentLanguage === "fr"
              ? "Notes"
              : "Grades";
      case "Resource":
        return currentLanguage === "en"
          ? "Resource"
          : currentLanguage === "ar"
            ? "المصادر"
            : currentLanguage === "fr"
              ? "Salles / Ressources"
              : "Ressources";
      case "Fees":
        return currentLanguage === "en"
          ? "Fees"
          : currentLanguage === "ar"
            ? "الرسوم"
            : currentLanguage === "fr"
              ? "Frais"
              : "Fees";
      default:
        return key; // Fallback to key if not found
    }
  };

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Container>
      <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {items.map((item, index) => (
    <Link
      key={index}
      href={item.href}
      className="flex h-[250px] w-full flex-col items-center justify-center rounded-xl bg-bgPrimary shadow-lg"
    >
      <div className="flex items-center justify-center">
        <div className="flex h-[87px] w-[87px] items-center justify-center rounded-full bg-bgRowTable">
          {item.icon}
        </div>
      </div>
      <p className="mt-4 text-[20px] font-semibold text-secondary">
        {getTranslatedText(item.key)}
      </p>
    </Link>
  ))}
</div>

      </Container>
    </>
  );
};

export default Archive;
