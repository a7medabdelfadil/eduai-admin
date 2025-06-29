"use client";
/* eslint-disable @next/next/no-img-element */
import Card from "@/components/card";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaBus } from "react-icons/fa"; // Bus Icon
import { FaChalkboardTeacher } from "react-icons/fa"; // Class Icon
import { FaBookOpen } from "react-icons/fa"; // Library Icon
import { FaDoorOpen } from "react-icons/fa"; // Room Icon
import { FaVideo } from "react-icons/fa"; // Cameras Icon
import { FaStore } from "react-icons/fa"; // Store Icon
import { FaBuilding } from "react-icons/fa"; // Office Icon
import { GiChemicalDrop } from "react-icons/gi"; // Lab Icon
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";

const Infrastructure = () => {
  const breadcrumbs = [
    {
      nameEn: "Operations",
      nameAr: "العمليات",
      nameFr: "Opérations",
      href: "/",
    },
    {
      nameEn: "Infrastructures",
      nameAr: "البنية التحتية",
      nameFr: "Infrastructures",
      href: "/infrastructure",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const infrastructureItems = [
    {
      href: "/infrastructure/bus",
      icon: <FaBus size={30} />,
      title:
        currentLanguage === "en"
          ? "Bus"
          : currentLanguage === "ar"
            ? "النقل المدرسي"
            : currentLanguage === "fr"
              ? "Bus Scolaire"
              : "Bus", // Default to English
      description:
        currentLanguage === "en"
          ? "Number Of Bus, Add New Bus And Edit a Bus"
          : currentLanguage === "ar"
            ? "عدد الحافلات، إضافة حافلة جديدة وتعديل حافلة"
            : currentLanguage === "fr"
              ? "Nombre d'autobus, ajouter un nouvel autobus et modifier un autobus"
              : "Number Of Bus, Add New Bus And Edit a Bus", // Default to English
    },
    {
      href: "/infrastructure/classes",
      icon: <FaChalkboardTeacher size={30} />,
      title:
        currentLanguage === "en"
          ? "Class"
          : currentLanguage === "ar"
            ? "الفصل"
            : currentLanguage === "fr"
              ? "Classes"
              : "Class", // Default to English
      description:
        currentLanguage === "en"
          ? "Number of class, add new class and edit a class"
          : currentLanguage === "ar"
            ? "عدد الفصول، إضافة فصل جديد وتعديل فصل"
            : currentLanguage === "fr"
              ? "Nombre de classes, ajouter une nouvelle classe et modifier une classe"
              : "Number of class, add new class and edit a class", // Default to English
    },
    {
      href: "/infrastructure/library",
      icon: <FaBookOpen size={30} />,
      title:
        currentLanguage === "en"
          ? "Library"
          : currentLanguage === "ar"
            ? "المكتبة"
            : currentLanguage === "fr"
              ? "Bibliothèque"
              : "Library", // Default to English
      description:
        currentLanguage === "en"
          ? "Number of book, add new book and edit a book"
          : currentLanguage === "ar"
            ? "عدد الكتب، إضافة كتاب جديد وتعديل كتاب"
            : currentLanguage === "fr"
              ? "Nombre de livres, ajouter un nouveau livre et modifier un livre"
              : "Number of book, add new book and edit a book", // Default to English
    },
    {
      href: "/infrastructure/store/digital-resource",
      icon: <FaStore size={30} />,
      title:
        currentLanguage === "en"
          ? "Store"
          : currentLanguage === "ar"
            ? "المخزن"
            : currentLanguage === "fr"
              ? "Magasin"
              : "Store", // Default to English
      description:
        currentLanguage === "en"
          ? "All information about digital resource, equipment"
          : currentLanguage === "ar"
            ? "كل المعلومات عن الموارد الرقمية، المعدات"
            : currentLanguage === "fr"
              ? "Toutes les informations sur les ressources numériques, l'équipement"
              : "All information about digital resource, equipment", // Default to English
    },
    {
      href: "/infrastructure/office",
      icon: <FaBuilding size={30} />,
      title:
        currentLanguage === "en"
          ? "Office"
          : currentLanguage === "ar"
            ? "المكتب"
            : currentLanguage === "fr"
              ? "Bureaux"
              : "Office", // Default to English
      description:
        currentLanguage === "en"
          ? "Number of office, add new office and edit an office"
          : currentLanguage === "ar"
            ? "عدد المكاتب، إضافة مكتب جديد وتعديل مكتب"
            : currentLanguage === "fr"
              ? "Nombre de bureaux, ajouter un nouveau bureau et modifier un bureau"
              : "Number of office, add new office and edit an office", // Default to English
    },
    {
      href: "/infrastructure/lab",
      icon: <GiChemicalDrop size={30} />,
      title:
        currentLanguage === "en"
          ? "Lab"
          : currentLanguage === "ar"
            ? "المختبر"
            : currentLanguage === "fr"
              ? "Laboratoire"
              : "Lab", // Default to English
      description:
        currentLanguage === "en"
          ? "Number of lab, add new lab and edit a lab"
          : currentLanguage === "ar"
            ? "عدد المختبرات، إضافة مختبر جديد وتعديل مختبر"
            : currentLanguage === "fr"
              ? "Nombre de laboratoires, ajouter un nouveau laboratoire et modifier un laboratoire"
              : "Number of lab, add new lab and edit a lab", // Default to English
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
          {infrastructureItems.map((item, index) => (
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

export default Infrastructure;
