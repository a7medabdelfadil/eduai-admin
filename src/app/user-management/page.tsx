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
      href: "/user-management/driver",
      icon: <FaCar size={30} />,
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
          ? "Manage All School Drivers"
          : currentLanguage === "ar"
            ? "إدارة جميع سائقي المدرسة"
            : currentLanguage === "fr"
              ? "Gérer tous les chauffeurs de l'école"
              : "Manage All School Drivers",
    },
    {
      href: "/user-management/employee",
      icon: <FaBriefcase size={30} />,
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
          ? "School Staff Management List"
          : currentLanguage === "ar"
            ? "قائمة إدارة موظفي المدرسة"
            : currentLanguage === "fr"
              ? "Liste de gestion du personnel scolaire"
              : "School Staff Management List",
    },
    {
      href: "/user-management/parent",
      icon: <FaUserFriends size={30} />,

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
          ? "Registered School Parents List"
          : currentLanguage === "ar"
            ? "قائمة أولياء أمور المدرسة المسجلين"
            : currentLanguage === "fr"
              ? "Liste des parents d'élèves enregistrés"
              : "Registered School Parents List",
    },
    {
      href: "/user-management/student",
      icon: <FaUserGraduate size={30} />,
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
          ? "All Enrolled School Students"
          : currentLanguage === "ar"
            ? "جميع الطلاب المسجلين في المدرسة"
            : currentLanguage === "fr"
              ? "Tous les élèves inscrits à l'école"
              : "All Enrolled School Students",
    },
    {
      href: "/user-management/teacher",
      icon: <FaChalkboardTeacher size={30} />,
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
          ? "Teacher List and Details"
          : currentLanguage === "ar"
            ? "قائمة المعلمين والتفاصيل"
            : currentLanguage === "fr"
              ? "Liste des enseignants et détails"
              : "Teacher List and Details",
    },
    {
      href: "/user-management/worker",
      icon: <FaHardHat size={30} />,
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
          ? "Workers and Maintenance Staff"
          : currentLanguage === "ar"
            ? "العمال وموظفو الصيانة"
            : currentLanguage === "fr"
              ? "Ouvriers et personnel de maintenance"
              : "Workers and Maintenance Staff",
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
        className={`${currentLanguage === "ar"
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
