"use client";
import Card from "@/components/card";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { AiOutlineCalendar } from "react-icons/ai"; // Events Icon
import { FaClipboardList } from "react-icons/fa"; // Exams Icon
import { FaRegChartBar } from "react-icons/fa"; // Grades Icon
import { BsCalendar } from "react-icons/bs"; // Schedule Icon
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";

const EducationalAffairs = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Educational Affairs",
      nameAr: "الشئون التعليمية",
      nameFr: "Gestion pédagogique",
      href: "/educational-affairs",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const Educations = [
    {
      href: "/educational-affairs/events",
      icon: <AiOutlineCalendar size={30} />,
      title:
        currentLanguage === "en"
          ? "Events"
          : currentLanguage === "ar"
            ? "الأحداث"
            : currentLanguage === "fr"
              ? "Événements"
              : "Events", // Default to English
      description:
        currentLanguage === "en"
          ? "Manage All School Events"
          : currentLanguage === "ar"
            ? "إدارة جميع أحداث المدرسة"
            : currentLanguage === "fr"
              ? "Gérer tous les événements scolaires"
              : "Manage All School Events" // Default to English
    },
    {
      href: "/educational-affairs/exams",
      icon: <FaClipboardList size={30} />,
      title:
        currentLanguage === "en"
          ? "Exams"
          : currentLanguage === "ar"
            ? "الامتحانات"
            : currentLanguage === "fr"
              ? "Examens"
              : "Exams", // Default to English
      description:
        currentLanguage === "en"
          ? "View All Scheduled Exams"
          : currentLanguage === "ar"
            ? "عرض جميع الامتحانات المجدولة"
            : currentLanguage === "fr"
              ? "Voir tous les examens programmés"
              : "View All Scheduled Exams" // Default to English
    },
    {
      href: "/educational-affairs/grades",
      icon: <FaRegChartBar size={30} />,
      title:
        currentLanguage === "en"
          ? "Grades"
          : currentLanguage === "ar"
            ? "الدرجات"
            : currentLanguage === "fr"
              ? "Notes"
              : "Grades", // Default to English
      description:
        currentLanguage === "en"
          ? "Track All Student Grades"
          : currentLanguage === "ar"
            ? "تتبع جميع درجات الطلاب"
            : currentLanguage === "fr"
              ? "Suivre toutes les notes des étudiants"
              : "Track All Student Grades" // Default to English
    },
    {
      href: "/educational-affairs/schedule",
      icon: <BsCalendar size={30} />,
      title:
        currentLanguage === "en"
          ? "Schedule"
          : currentLanguage === "ar"
            ? "الجدول"
            : currentLanguage === "fr"
              ? "Emploi du temps"
              : "Schedule", // Default to English
      description:
        currentLanguage === "en"
          ? "View and Edit Schedules"
          : currentLanguage === "ar"
            ? "عرض وتحرير الجداول"
            : currentLanguage === "fr"
              ? "Voir et modifier les emplois du temps"
              : "View and Edit Schedules" // Default to English
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
          } mt-12 grid justify-center`}
      >
        <div className="grid grid-cols-2 gap-5 max-[577px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
          {Educations.map((item, index) => (
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

export default EducationalAffairs;
