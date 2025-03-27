"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import {
  useGetAllWorkersQuery,
  useGetWorkerByIdQuery,
} from "@/features/User-Management/workerApi";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const WorkerSearch = () => {
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Student = Record<string, any>;
  const { data, error, isLoading } = useGetAllWorkersQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (data) {
      const filtered = data.data.content.filter((student: Student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredStudents(filtered);
    }
  }, [data, searchTerm, error]);

  const [selectedId, setSelectedId] = useState(null);
  const { data: EmployeeQ, isLoading: isEmployee } = useGetWorkerByIdQuery(
    selectedId,
    {
      skip: !selectedId,
    },
  );
  const handleClick = (id: SetStateAction<null>) => {
    setSelectedId(id);
  };

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
                className="text-blue-500 underline underline-offset-4"
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
                className="underline-offset-4 hover:text-blue-500 hover:underline"
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
                          className="size-4 flex-shrink-0 text-textPrimary"
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
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
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
                    {filteredStudents.length}{" "}
                    {currentLanguage === "en"
                      ? "Workers Found"
                      : currentLanguage === "ar"
                        ? "عمال تم العثور عليهم"
                        : currentLanguage === "fr"
                          ? "Travailleurs trouvés"
                          : "Workers Found"}{" "}
                    {/* Default to English */}
                  </p>
                </div>
                <div className="grid h-[450px] w-full overflow-y-auto">
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <div className="h-full w-full overflow-y-auto">
                      {filteredStudents.length > 0 && searchTerm ? (
                        <ul className="mt-12 grid w-full gap-2 overflow-y-auto">
                          {filteredStudents.map(student => (
                            <div
                              onClick={() => handleClick(student.id)}
                              key={student.id}
                              className="flex w-full cursor-pointer items-center rounded-lg border border-borderPrimary px-2 py-1 hover:bg-bgPrimary"
                            >
                              <div>
                                {student.picture == null ? (
                                  <img
                                    src="/images/userr.png"
                                    className="mx-2 h-[40px] w-[40px] rounded-full"
                                    alt="#"
                                  />
                                ) : (
                                  <img
                                    src={student.picture}
                                    className="mx-2 h-[40px] w-[40px] rounded-full"
                                    alt="#"
                                  />
                                )}
                              </div>
                              <div className="grid gap-2">
                                <p className="font-semibold">
                                  {String(student.name)}
                                </p>
                                <p className="font-semibold text-secondary">
                                  ID: {student.id}
                                </p>
                              </div>
                            </div>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <img src="/images/nothing.png" alt="" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="grid h-full w-full items-center overflow-hidden text-ellipsis rounded-xl border border-borderPrimary">
                {isEmployee ? (
                  <Spinner />
                ) : (
                  <div className="mt-16 grid items-center justify-center">
                    {EmployeeQ ? (
                      <div>
                        <div className="flex justify-end">
                          <Link
                            className="rounded-lg bg-primary px-2 py-1 font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
                            href={`/worker/view-worker/${EmployeeQ.data.id}`}
                          >
                            {currentLanguage === "ar"
                              ? "عرض"
                              : currentLanguage === "fr"
                                ? "Voir"
                                : "View"}
                          </Link>
                        </div>
                        <div className="grid items-center justify-center text-center">
                          {EmployeeQ?.data.picture == null ? (
                            <img
                              src="/images/userr.png"
                              className="mx-2 h-[120px] w-[120px] rounded-full"
                              alt="#"
                            />
                          ) : (
                            <img
                              src={EmployeeQ?.data.picture}
                              className="mx-2 h-[120px] w-[120px] rounded-full"
                              alt="#"
                            />
                          )}
                          <h1 className="font-semibold text-textSecondary">
                            {EmployeeQ?.data.name}
                          </h1>
                        </div>

                        <div className="grid justify-start">
                          <h1 className="text-[22px] font-semibold text-textSecondary">
                            {currentLanguage === "ar"
                              ? "تفاصيل أساسية"
                              : currentLanguage === "fr"
                                ? "Détails de base"
                                : "Basic Details"}
                          </h1>
                          <div className="grid w-[400px] grid-cols-2 max-[485px]:w-[240px]">
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "البريد الإلكتروني:"
                                : currentLanguage === "fr"
                                  ? "Email:"
                                  : "Email:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.email}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "الراتب:"
                                : currentLanguage === "fr"
                                  ? "Salaire:"
                                  : "Salary:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.salary == null
                                ? currentLanguage === "ar"
                                  ? "غير محدد"
                                  : currentLanguage === "fr"
                                    ? "Non spécifié"
                                    : "Not specified"
                                : EmployeeQ?.data.salary}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "العمر:"
                                : currentLanguage === "fr"
                                  ? "Âge:"
                                  : "Age:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.birthDate}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "الجنس:"
                                : currentLanguage === "fr"
                                  ? "Genre:"
                                  : "Gender:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.gender}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "الوظيفة:"
                                : currentLanguage === "fr"
                                  ? "Poste:"
                                  : "Position:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.role}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "الديانة:"
                                : currentLanguage === "fr"
                                  ? "Religion:"
                                  : "Religion:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.religion}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "العنوان:"
                                : currentLanguage === "fr"
                                  ? "Adresse:"
                                  : "Address:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.nationality}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "رقم الهاتف:"
                                : currentLanguage === "fr"
                                  ? "Mobile:"
                                  : "Mobile:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.phoneNumber}
                            </p>
                            <h3 className="font-semibold text-textPrimary">
                              {currentLanguage === "ar"
                                ? "عن:"
                                : currentLanguage === "fr"
                                  ? "À propos:"
                                  : "About:"}
                            </h3>
                            <p className="font-semibold text-textSecondary">
                              {EmployeeQ?.data.about}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerSearch;
