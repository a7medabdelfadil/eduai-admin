"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Card from "@/components/card";
import {
  FaUserGraduate,
  FaCar,
  FaBriefcase,
  FaUserFriends,
  FaChalkboardTeacher,
  FaHardHat,
} from "react-icons/fa";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";

const UserManagment = () => {
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const UserManagments = [
    {
      href: "/driver",
      icon: <FaCar size={40} />,
      title:
        currentLanguage === "en"
          ? "Drivers"
          : currentLanguage === "ar"
            ? "السائقون"
            : currentLanguage === "fr"
              ? "Chauffeurs"
              : "Driver",
      description:
        currentLanguage === "en"
          ? "Number of Drivers"
          : currentLanguage === "ar"
            ? "عدد السائقين"
            : currentLanguage === "fr"
              ? "Nombre de conducteurs"
              : "Number of Drivers",
    },
    {
      href: "/employee",
      icon: <FaBriefcase size={40} />,
      title:
        currentLanguage === "en"
          ? "Employees"
          : currentLanguage === "ar"
            ? "الموظفون"
            : currentLanguage === "fr"
              ? "Employés"
              : "Employee",
      description:
        currentLanguage === "en"
          ? "Number of Employees"
          : currentLanguage === "ar"
            ? "عدد الموظفين"
            : currentLanguage === "fr"
              ? "Nombre d'employés"
              : "Number of Employees",
    },
    {
      href: "/parent",
      icon: <FaUserFriends size={40} />,

      title:
        currentLanguage === "en"
          ? "Parents"
          : currentLanguage === "ar"
            ? "الآباء"
            : currentLanguage === "fr"
              ? "Parents"
              : "Parent",
      description:
        currentLanguage === "en"
          ? "Number of Parents"
          : currentLanguage === "ar"
            ? "عدد أولياء الأمور"
            : currentLanguage === "fr"
              ? "Nombre de parents"
              : "Number of Parents",
    },
    {
      href: "/student",
      icon: <FaUserGraduate size={40} />,
      title:
        currentLanguage === "en"
          ? "Students"
          : currentLanguage === "ar"
            ? "الطلاب"
            : currentLanguage === "fr"
              ? "Étudiants"
              : "Student",
      description:
        currentLanguage === "en"
          ? "Number of Students"
          : currentLanguage === "ar"
            ? "عدد الطلاب"
            : currentLanguage === "fr"
              ? "Nombre d'étudiants"
              : "Number of Students",
    },
    {
      href: "/teacher",
      icon: <FaChalkboardTeacher size={40} />,
      title:
        currentLanguage === "en"
          ? "Teachers"
          : currentLanguage === "ar"
            ? "المعلمون"
            : currentLanguage === "fr"
              ? "Enseignants"
              : "Teacher",
      description:
        currentLanguage === "en"
          ? "All Teachers"
          : currentLanguage === "ar"
            ? "جميع المعلمين"
            : currentLanguage === "fr"
              ? "Tous les enseignants"
              : "All Teachers",
    },
    {
      href: "/worker",
      icon: <FaHardHat size={40} />,
      title:
        currentLanguage === "en"
          ? "Workers"
          : currentLanguage === "ar"
            ? "العمال"
            : currentLanguage === "fr"
              ? "Travailleurs"
              : "Worker",
      description:
        currentLanguage === "en"
          ? "All Workers"
          : currentLanguage === "ar"
            ? "جميع العمال"
            : currentLanguage === "fr"
              ? "Tous les travailleurs"
              : "All Workers",
    },
  ];

  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "User Management",
      nameAr: "إدارة المستخدمين",
      nameFr: "Gestion des utilisateurs",
      href: "/user-management",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[40px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[40px]"
              : "lg:ml-[290px]"
        } mt-12 grid justify-center`}
      >
        <div className="grid grid-cols-2 gap-5 max-[577px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {UserManagments.map((item, index) => (
            <Card
              key={index}
              href={item.href}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserManagment;
