"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";

const FeesSearch = () => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
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
      <div
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[90px]"
              : "lg:mr-[290px]"
            : booleanValue
              ? "lg:ml-[90px]"
              : "lg:ml-[290px]"
        } mt-12`}
      >
        <div className="flex h-full w-full justify-center overflow-auto p-2">
          <div className="grid h-full w-full overflow-auto rounded-xl bg-bgPrimary">
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="flex h-[70px] items-center gap-7 overflow-auto rounded-t-xl bg-bgPrimary px-3 font-semibold"
            >
              <Link
                className="underline-offset-4 hover:text-blue-500 hover:underline"
                href="/search"
              >
                {currentLanguage === "en"
                  ? "Students"
                  : currentLanguage === "ar"
                    ? "طلاب"
                    : currentLanguage === "fr"
                      ? "Étudiants"
                      : "Student"}{" "}
                {/* Default to English */}
              </Link>
              <Link
                className="underline-offset-4 hover:text-blue-500 hover:underline"
                href="/search/teacher"
              >
                {currentLanguage === "en"
                  ? "Teachers"
                  : currentLanguage === "ar"
                    ? "معلمون"
                    : currentLanguage === "fr"
                      ? "Enseignants"
                      : "Teacher"}{" "}
                {/* Default to English */}
              </Link>
              <Link
                className="underline-offset-4 hover:text-blue-500 hover:underline"
                href="/search/employee"
              >
                {currentLanguage === "en"
                  ? "Employees"
                  : currentLanguage === "ar"
                    ? "موظفون"
                    : currentLanguage === "fr"
                      ? "Employés"
                      : "Employee"}{" "}
                {/* Default to English */}
              </Link>
              <Link
                className="underline-offset-4 hover:text-blue-500 hover:underline"
                href="/search/worker"
              >
                {currentLanguage === "en"
                  ? "Workers"
                  : currentLanguage === "ar"
                    ? "عمال"
                    : currentLanguage === "fr"
                      ? "Travailleurs"
                      : "Worker"}{" "}
                {/* Default to English */}
              </Link>
              <Link
                className="text-blue-500 underline underline-offset-4"
                href="/search/fees"
              >
                {currentLanguage === "en"
                  ? "Fees"
                  : currentLanguage === "ar"
                    ? "رسوم"
                    : currentLanguage === "fr"
                      ? "Frais"
                      : "Fees"}{" "}
                {/* Default to English */}
              </Link>
              <Link
                className="underline-offset-4 hover:text-blue-500 hover:underline"
                href="/search/infrastructure"
              >
                {currentLanguage === "en"
                  ? "Infrastructure"
                  : currentLanguage === "ar"
                    ? "البنية التحتية"
                    : currentLanguage === "fr"
                      ? "Infrastructure"
                      : "Infrastructure"}{" "}
                {/* Default to English */}
              </Link>
            </div>
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="grid grid-cols-1 gap-4 p-7 xl:grid-cols-2"
            >
              <div className="grid p-4">
                <div className="flex gap-3 md:justify-center">
                  <div>
                    <label htmlFor="icon" className="sr-only">
                      Search
                    </label>
                    <div className="relative min-w-48 md:min-w-80">
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
                  <div>
                    <select
                      id="countries"
                      className="block h-full w-full rounded-lg border border-borderPrimary bg-bgSecondary p-1.5 text-sm text-textPrimary outline-none focus:border-borderPrimary"
                    >
                      <option selected>
                        {currentLanguage === "en"
                          ? "Search by Name"
                          : currentLanguage === "ar"
                            ? "البحث بالاسم"
                            : "Rechercher par nom"}
                      </option>
                    </select>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="font-semibold">
                    {currentLanguage === "en"
                      ? "0 Fees Found"
                      : currentLanguage === "ar"
                        ? "لم يتم العثور على رسوم"
                        : "0 frais trouvés"}
                  </p>
                </div>
                <div className="grid h-[450px] items-center justify-center">
                  <img src="/images/nothing.png" alt="" />
                </div>
              </div>
              <div className="h-full w-full rounded-xl border border-borderPrimary"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeesSearch;
