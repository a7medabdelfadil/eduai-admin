/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useGetAllDisciplinaryRecordsQuery } from "@/features/Document-Management/disciplinaryApi";

const Disciplinary = () => {
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
      nameEn: "Disciplinary Records",
      nameAr: "السجلات التأديبية",
      nameFr: "Dossiers disciplinaires",
      href: "/document-management/other/disciplinary",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const {
    data: disciplinaryData,
    isLoading: isDisciplinaryLoading,
    isError,
  } = useGetAllDisciplinaryRecordsQuery(null);

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
          } relative mx-3 mt-10 h-screen overflow-x-auto bg-transparent sm:rounded-lg`}
      >
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
          <div className="flex justify-center">
            <Link
              href="/document-management/other/disciplinary/add-disciplinary"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
            >
              Add Disciplinary Notice
            </Link>
          </div>
        </div>
        <div className="justify-left mb-[80px] ml-4 mt-[50px] flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link href="/document-management/other">
            {currentLanguage === "ar"
              ? "بطاقات الهوية"
              : currentLanguage === "fr"
                ? "Cartes d'identité"
                : "ID Cards"}
          </Link>
          <Link href="/document-management/other/medical">
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            href="/document-management/other/disciplinary"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link href="/document-management/other/financial">
            {currentLanguage === "ar"
              ? "المساعدات المالية"
              : currentLanguage === "fr"
                ? "Aide financière"
                : "Financial Aid"}
          </Link>
          <Link href="/document-management/other/legal">
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الاسم"
                    : currentLanguage === "fr"
                      ? "Nom"
                      : "Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "المعرف"
                    : currentLanguage === "fr"
                      ? "ID"
                      : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الجنس"
                    : currentLanguage === "fr"
                      ? "Sexe"
                      : "Gender"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "رقم التاكسي"
                    : currentLanguage === "fr"
                      ? "Numéro de taxi"
                      : "Taxi Number"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "رقم الهاتف"
                    : currentLanguage === "fr"
                      ? "Mobile"
                      : "Mobile"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "عن السائق"
                    : currentLanguage === "fr"
                      ? "À propos"
                      : "About"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "عرض"
                    : currentLanguage === "fr"
                      ? "Voir"
                      : "View"}
                </th>
              </tr>
            </thead>
            <tbody>
              {isDisciplinaryLoading ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-red-500">
                    {currentLanguage === "ar"
                      ? "حدث خطأ أثناء تحميل البيانات"
                      : currentLanguage === "fr"
                        ? "Erreur de chargement"
                        : "Error loading data"}
                  </td>
                </tr>
              ) : disciplinaryData?.data?.content?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-500">
                    {currentLanguage === "ar"
                      ? "لا توجد سجلات تأديبية"
                      : currentLanguage === "fr"
                        ? "Aucun dossier disciplinaire"
                        : "No disciplinary records found"}
                  </td>
                </tr>
              ) : (
                disciplinaryData?.data?.content?.map((record: any) => (
                  <tr
                    key={record.id}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                  >
                    <th
                      scope="row"
                      className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                    >
                      <img
                        src={record.picture}
                        className="mx-2 h-[40px] w-[40px] rounded-full"
                        alt="profile"
                      />
                      {record.name}
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">{record.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {record.gender === "MALE"
                        ? currentLanguage === "ar"
                          ? "ذكر"
                          : currentLanguage === "fr"
                            ? "Homme"
                            : "Male"
                        : currentLanguage === "ar"
                          ? "أنثى"
                          : currentLanguage === "fr"
                            ? "Femme"
                            : "Female"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">{record.role}</td>
                    <td className="whitespace-nowrap px-6 py-4">{record.mobile}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {record.violationType.replace(/_/g, " ")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/document-management/other/disciplinary/${record.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar"
                          ? "عرض"
                          : currentLanguage === "fr"
                            ? "Voir"
                            : "View"}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
};

export default Disciplinary;
