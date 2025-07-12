"use client";
import Card from "@/components/card";
/* eslint-disable @next/next/no-img-element */
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { RiFileList2Line } from "react-icons/ri"; // Report
import { AiOutlineSafetyCertificate } from "react-icons/ai"; // Permission
import {
  FaCalendarAlt,
  FaClock,
  FaExclamationTriangle,
  FaTasks,
  FaUmbrellaBeach,
} from "react-icons/fa"; // Semester, Annual Leave
import { MdBusiness, MdWorkOutline } from "react-icons/md"; // Department, Position
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { LuSchool } from "react-icons/lu";

const OrganizationSettings = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const settings = [
    {
      href: "/organization-setting/reports",
      icon: <RiFileList2Line size={30} />,
      title:
        currentLanguage === "en"
          ? "Reports"
          : currentLanguage === "ar"
            ? "التقارير"
            : currentLanguage === "fr"
              ? "Rapports"
              : "Reports", // Default to English
      description:
        currentLanguage === "en"
          ? "All user Reports"
          : currentLanguage === "ar"
            ? "جميع تقارير المستخدمين"
            : currentLanguage === "fr"
              ? "Tous les rapports des utilisateurs"
              : "All user Reports", // Default to English
    },
    {
      href: "/organization-setting/permissions/employee-permission",
      icon: <AiOutlineSafetyCertificate size={30} />,
      title:
        currentLanguage === "en"
          ? "Permission"
          : currentLanguage === "ar"
            ? "الصلاحيات"
            : currentLanguage === "fr"
              ? "Permissions"
              : "Permission", // Default to English
      description:
        currentLanguage === "en"
          ? "All Permissions"
          : currentLanguage === "ar"
            ? "جميع الصلاحيات"
            : currentLanguage === "fr"
              ? "Toutes les permissions"
              : "All Permissions", // Default to English
    },
    {
      href: "/organization-setting/semester",
      icon: <FaCalendarAlt size={30} />,
      title:
        currentLanguage === "en"
          ? "Semester"
          : currentLanguage === "ar"
            ? "الفصل الدراسي"
            : currentLanguage === "fr"
              ? "Sessions"
              : "Semester", // Default to English
      description:
        currentLanguage === "en"
          ? "Enter semester information"
          : currentLanguage === "ar"
            ? "أدخل معلومات الفصل الدراسي"
            : currentLanguage === "fr"
              ? "Entrer les informations du semestre"
              : "Enter semester information", // Default to English
    },
    {
      href: "/organization-setting/department",
      icon: <MdBusiness size={30} />,
      title:
        currentLanguage === "en"
          ? "Department"
          : currentLanguage === "ar"
            ? "القسم"
            : currentLanguage === "fr"
              ? "Classes"
              : "Department", // Default to English
      description:
        currentLanguage === "en"
          ? "Enter Departments information"
          : currentLanguage === "ar"
            ? "أدخل معلومات الأقسام"
            : currentLanguage === "fr"
              ? "Entrer les informations des départements"
              : "Enter Departments information", // Default to English
    },
    {
      href: "/organization-setting/position",
      icon: <MdWorkOutline size={30} />,
      title:
        currentLanguage === "en"
          ? "Position"
          : currentLanguage === "ar"
            ? "المنصب"
            : currentLanguage === "fr"
              ? "Postes"
              : "Position", // Default to English
      description:
        currentLanguage === "en"
          ? "Enter Position information"
          : currentLanguage === "ar"
            ? "أدخل معلومات المنصب"
            : currentLanguage === "fr"
              ? "Entrer les informations de poste"
              : "Enter Position information", // Default to English
    },
    {
      href: "/organization-setting/annual",
      icon: <FaUmbrellaBeach size={30} />,
      title:
        currentLanguage === "en"
          ? "Annual Leave"
          : currentLanguage === "ar"
            ? "الإجازة السنوية"
            : currentLanguage === "fr"
              ? "Congés Annuels"
              : "Annual Leave", // Default to English
      description:
        currentLanguage === "en"
          ? "All Annual Leave"
          : currentLanguage === "ar"
            ? "كل الإجازات السنوية"
            : currentLanguage === "fr"
              ? "Tous les congés annuels"
              : "All Annual Leave", // Default to English
    },
    {
      href: "/organization-setting/complaint",
      icon: <FaExclamationTriangle size={30} />,
      title:
        currentLanguage === "en"
          ? "Complaint"
          : currentLanguage === "ar"
            ? "شكوى "
            : currentLanguage === "fr"
              ? "Réclamationss"
              : "Plainte", // Default to English
      description:
        currentLanguage === "en"
          ? "Manage and Review Complaints"
          : currentLanguage === "ar"
            ? "إدارة ومراجعة الشكاوى"
            : currentLanguage === "fr"
              ? "Gérer et examiner les plaintes"
              : "Manage and Review Complaints", // Default to English
    },
    {
      href: "/organization-setting/payment",
      icon: <FaClock size={30} />,
      title:
        currentLanguage === "en"
          ? "Payment  Due Date"
          : currentLanguage === "ar"
            ? "تاريخ استحقاق الدفع "
            : currentLanguage === "fr"
              ? "Date d'échéance du paiement"
              : "Date d'échéance du paiement", // Default to English
      description:
        currentLanguage === "en"
          ? "Monitor All Payment Dates"
          : currentLanguage === "ar"
            ? "مراقبة جميع تواريخ الدفع"
            : currentLanguage === "fr"
              ? "Surveiller toutes les dates de paiement"
              : "Monitor All Payment Dates", // Default to English
    },
    {
      href: "/organization-setting/exams",
      icon: <FaTasks size={30} />,
      title:
        currentLanguage === "en"
          ? "Exam Type"
          : currentLanguage === "ar"
            ? "نوع الامتحان "
            : currentLanguage === "fr"
              ? "Type d'examen"
              : "Type d'examen", // Default to English
      description:
        currentLanguage === "en"
          ? "Some information about Exam type "
          : currentLanguage === "ar"
            ? "بعض المعلومات حول الامتحانات"
            : currentLanguage === "fr"
              ? "Quelques informations sur le type d'examen"
              : "All Annual Leave", // Default to English
    },
    {
      href: "/organization-setting/edit-school-logo",
      icon: <LuSchool size={30} />,
      title:
        currentLanguage === "en"
          ? "School Logo"
          : currentLanguage === "ar"
            ? "شعار المدرسة"
            : currentLanguage === "fr"
              ? "Logo de l'école"
              : "School Logo", // Default to English
      description:
        currentLanguage === "en"
          ? "To edit the school's logo"
          : currentLanguage === "ar"
            ? "لتعديل شعار المدرسة"
            : currentLanguage === "fr"
              ? "Pour modifier le logo de l'écolen"
              : "To edit the school's logo", // Default to English
    },
  ];

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
          } my-12 grid justify-center`}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {settings.map((item, index) => (
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

export default OrganizationSettings;
