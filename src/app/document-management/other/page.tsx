/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { Text } from "@/components/Text";


const cardData = [
  {
    name: 'Wade Warren',
    id: '5412',
    role: 'Teacher',
    img: '/images/userr.png',
    frontCard: '/images/card.png',
    backCard: '/images/card.png',
  },
  {
    name: 'Wade Warren',
    id: '5412',
    role: 'Teacher',
    img: '/images/userr.png',
    frontCard: '/images/card.png',
    backCard: '/images/card.png',
  },
  {
    name: 'Olivia Wilson',
    id: '123456',
    role: 'Student',
    img: '/images/userr.png',
    frontCard: '/images/card.png',
    backCard: '/images/card.png',
  },
];

const Card = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Document Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/document-management",
    },
    {
      nameEn: "Other Official Documents",
      nameAr: "وثائق رسمية أخرى",
      nameFr: "Autres documents officiels",
      href: "/document-management/other",
    },
    {
      nameEn: "ID Cards",
      nameAr: "بطاقات الهوية",
      nameFr: "Cartes d'identité",
      href: "/document-management/other/card",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    checkboxes.forEach(checkbox => {
      checkbox.checked = !selectAll;
    });
  };

  useEffect(() => {
    const handleOtherCheckboxes = () => {
      const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not(#checkbox-all-search)',
      );
      const allChecked = Array.from(allCheckboxes).every(
        checkbox => checkbox.checked,
      );
      const selectAllCheckbox = document.getElementById(
        "checkbox-all-search",
      ) as HTMLInputElement | null;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
        setSelectAll(allChecked);
      }
    };

    const otherCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    otherCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", handleOtherCheckboxes);
    });

    return () => {
      otherCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener("change", handleOtherCheckboxes);
      });
    };
  }, []);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

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
            ? "lg:mr-[100px]"
            : "lg:mr-[270px]"
          : booleanValue
            ? "lg:ml-[100px]"
            : "lg:ml-[270px]"
          } relative mx-3 mt-10 h-screen bg-transparent sm:rounded-lg`}
      >
        <Text font={"bold"} size={"3xl"}>Other Official Documents</Text>
        <div className="justify-left ml-4 my-8 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/document-management/other"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "بطاقات الهوية"
              : currentLanguage === "fr"
                ? "Cartes d'identité"
                : "ID Cards"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/medical">
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/disciplinary">
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/financial">
            {currentLanguage === "ar"
              ? "المساعدات المالية"
              : currentLanguage === "fr"
                ? "Aide financière"
                : "Financial Aid"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/legal">
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                id="icon"
                name="icon"
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                placeholder={
                  currentLanguage === "en"
                    ? "Search"
                    : currentLanguage === "ar"
                      ? "بحث"
                      : "Recherche"
                }
              />
            </div>
          </div>
        </div>
        <div className="relative bg-bgPrimary shadow-md sm:rounded-lg p-6">
          <div className="space-y-6">
            {cardData.map((card, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row mt-4 items-center justify-between md:items-start gap-6 pb-6"
              >
                {/* Profile */}
                <div className="flex items-center mx-4 mt-14 gap-4 min-w-[200px] h-full">
                  <img
                    src={card.img}
                    alt={card.name}
                    className="rounded-full w-[50px] object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{card.name}</h3>
                    <p className="text-sm text-gray-600">ID: {card.id}</p>
                    <p className="text-sm font-medium">{card.role}</p>
                  </div>
                </div>
                <div className="flex justify-evenly items-center gap-4 w-full">

                  {/* Card Image front */}
                  <div className="flex-1 max-w-[350px]">
                    <img
                      src={card.frontCard}
                      alt="Front of ID Card"
                      className="rounded w-full shadow-md"
                    />
                  </div>
                  {/* Card Image back */}
                  <div className="flex-1 max-w-[350px]">
                    <img
                      src={card.backCard}
                      alt="Back of ID Card"
                      className="rounded w-full shadow-md"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
