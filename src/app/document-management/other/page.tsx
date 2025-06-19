/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { Text } from "@/components/Text";
import CardFrontComponent from "@/components/CardFrontComponent";
import CardBackComponent from "@/components/CardBackComponent";
import Container from "@/components/Container";
import { useGetIdCardsQuery } from "@/features/Document-Management/otherOfficialDocumentsApi";

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
      href: "/document-management/otherno",
    },
    {
      nameEn: "ID Cards",
      nameAr: "بطاقات الهوية",
      nameFr: "Cartes d'identité",
      href: "/document-management/other",
    },
  ];

  const [selectedRole, setSelectedRole] = useState("TEACHER");

  const {
    data: idCards,
    isLoading,
    isFetching,
    error,
  } = useGetIdCardsQuery(selectedRole);
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
      <Container>
        <Text font={"bold"} size={"3xl"}>
          {currentLanguage === "ar"
            ? "وثائق رسمية أخرى"
            : currentLanguage === "fr"
              ? "Autres documents officiels"
              : "Other Official Documents"}
        </Text>
        <div className="justify-left my-8 ml-4 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
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
            href="/document-management/other/medical"
          >
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/disciplinary"
          >
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>

          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/legal"
          >
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
                className="block w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
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
          <div className="flex items-center gap-4">
            <label htmlFor="roleSelect" className="text-sm font-medium">
              Filter by Role:
            </label>
            <select
              id="roleSelect"
              className="rounded-md border border-borderPrimary bg-bgPrimary px-3 py-1 text-sm"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
            >
              <option value="TEACHER">Teacher</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>
        </div>
        <div className="relative w-full overflow-x-auto bg-bgPrimary p-6 shadow-md sm:rounded-lg">
          {isFetching ? (
            <div className="flex w-full items-center justify-center py-10">
              <Spinner />
            </div>
          ) : (
            <div className="space-y-6">
              {idCards.map((card: any, index: any) => (
                <div
                  key={index}
                  className="mt-4 flex flex-col items-center justify-between gap-6 pb-6 md:flex-row md:items-start"
                >
                  {/* Profile */}
                  <div className="mx-4 mt-14 flex h-full w-[250px] items-center gap-4">
                    <img
                      src={
                        card.hasPicture && card.picture
                          ? card.picture
                          : "/images/userr.png"
                      }
                      alt={card.name}
                      className="h-[50px] w-[50px] rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{card.name}</h3>
                      <p className="text-sm text-gray-600">ID: {card.id}</p>
                      <p className="text-sm font-medium">{card.role}</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-around">
                    {/* Card Image back */}

                    <div className="mx-4 aspect-[7/4] w-full max-w-[400px]">
                      <CardBackComponent />
                    </div>
                    <div className="mx-4 aspect-[7/4] w-full max-w-[400px]">
                      <CardFrontComponent
                        name={card.name}
                        studentId={card.id.toString()}
                        gradeYear={card.academicYear || "N/A"}
                        issueDate={card.birthDate || "N/A"}
                        imageSrc={
                          card.hasPicture && card.picture
                            ? card.picture
                            : "/images/userr.png"
                        }
                        role={card.role}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default Card;
