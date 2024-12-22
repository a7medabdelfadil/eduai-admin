"use client";
import Link from "next/link";
import { useGetAllClasssQuery } from "@/features/Infrastructure/classApi";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import Spinner from "@/components/spinner";
import { useEffect, useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";

const Infrastructure = () => {
  const breadcrumbs = [
    {
      nameEn: "Dashboard",
      nameAr: "لوحة القيادة",
      nameFr: "Tableau de bord",
      href: "/",
    },
    {
      nameEn: "Classes",
      nameAr: "الفصل",
      nameFr: "Classe",
      href: "/classes",
    },
  ];

  type Class = Record<string, any>;
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, error, isLoading } = useGetAllClasssQuery(null);
  const [search, setSearch] = useState("");

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  if (loading || isLoading)
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
        className={`flex justify-between ${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[150px]"
              : "lg:mr-[320px]"
            : booleanValue
              ? "lg:ml-[150px]"
              : "lg:ml-[320px]"
        } mt-16 text-center max-[502px]:grid max-[502px]:justify-center lg:mr-[40px]`}
      >
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
              onChange={e => setSearch(e.target.value)}
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
            href="/classes/add-class"
            className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
          >
            {currentLanguage === "ar"
              ? "+ إضافة فصل"
              : currentLanguage === "fr"
                ? "+ Ajouter une classe"
                : "+ Add Class"}
          </Link>
        </div>
      </div>
      <div
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[120px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[120px]"
              : "lg:ml-[290px]"
        } grid justify-center`}
      >
        <div className="mt-5 grid grid-cols-1 justify-center gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
          {data?.data.content
            .filter((classItem: Class) => {
              return search.toLocaleLowerCase() === ""
                ? classItem
                : classItem.classroomName.toLocaleLowerCase().includes(search);
            })
            .map((classItem: Class) => (
              <div key={classItem.roomId}>
                <Link href={`/class-detials/${classItem.roomId}`}>
                  <div className="flex h-[130px] w-[200px] items-center justify-center gap-2 rounded-xl bg-bgPrimary p-2 shadow-xl max-[640px]:w-[300px]">
                    <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-info text-center text-[18px] font-bold text-white">
                      {classItem.classroomName}
                    </div>
                    <div className="grid text-[13px] font-semibold">
                      <p className="text-secondary">
                        {currentLanguage === "ar"
                          ? "عدد الطلاب"
                          : currentLanguage === "fr"
                            ? "N. Étudiant"
                            : "N.Student"}
                      </p>
                      <p>30</p>
                      <p className="text-secondary">
                        {currentLanguage === "ar"
                          ? "عدد الطلاب"
                          : currentLanguage === "fr"
                            ? "N. Étudiant"
                            : "N.Student"}
                      </p>
                      <p>4</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Infrastructure;
