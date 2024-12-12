"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useGetAllExamsQuery,
  useDeleteExamMutation,
} from "@/features/Acadimic/examsApi";

const Exams = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Educational Affairs",
      nameAr: "الدورات والموارد",
      nameFr: "Cours et Ressources",
      href: "/educational-affairs",
    },
    {
      nameEn: "Exams",
      nameAr: "المكتبة",
      nameFr: "Autoexam",
      href: "/educational-affairs/exams",
    },
  ];

  const { data, error, isLoading, refetch } = useGetAllExamsQuery(null);
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data) console.log("Response Data:", data);
    if (error) console.log("Error:", error);
  }, [data, error]);

  const [deleteExames] = useDeleteExamMutation();
  type Exam = Record<string, any>;

  const handleDelete = async (id: number) => {
    console.log(id);
    try {
      await deleteExames(id).unwrap();

      toast.success(`Exam with ID ${id} Deleted successfully`);
      void refetch();
    } catch {
      toast.error("Failed to Delete the Exam");
    }
  };

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
        className={`${
          currentLanguage === "ar"
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
              href="/educational-affairs/exams/add-exam"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة حافلة جديدة"
                : currentLanguage === "fr"
                  ? "+ Ajouter un nouveau exam"
                  : "+ Add New Exam"}
            </Link>
          </div>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="-gray-800 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "رقم الحافلة"
                    : currentLanguage === "fr"
                      ? "Numéro de exam"
                      : "Exam Date"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "سعة الحافلة"
                    : currentLanguage === "fr"
                      ? "Capacité du exam"
                      : "Exam Beginning"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "رقم المدرسة"
                    : currentLanguage === "fr"
                      ? "ID de l'école"
                      : "Exam Ending"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تاريخ الإنشاء"
                    : currentLanguage === "fr"
                      ? "Date de création"
                      : "teacher Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تاريخ التحديث"
                    : currentLanguage === "fr"
                      ? "Date de mise à jour"
                      : "course Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تاريخ التحديث"
                    : currentLanguage === "fr"
                      ? "Date de mise à jour"
                      : "semester Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تاريخ التحديث"
                    : currentLanguage === "fr"
                      ? "Date de mise à jour"
                      : "class Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تاريخ التحديث"
                    : currentLanguage === "fr"
                      ? "Date de mise à jour"
                      : "exam Type Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الإجراء"
                    : currentLanguage === "fr"
                      ? "Action"
                      : "View"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الإجراء"
                    : currentLanguage === "fr"
                      ? "Action"
                      : "Action"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تعديل"
                    : currentLanguage === "fr"
                      ? "Modifier"
                      : "Edit"}
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                ?.filter((exam: Exam) => {
                  return search.toLocaleLowerCase() === ""
                    ? exam
                    : exam.teacherName.toLocaleLowerCase().includes(search);
                })
                .map((exam: Exam, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="h-4 w-4 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                        />
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-secondary"
                    >
                      {exam.examDate}
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">
                      {exam.examBeginning}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {exam.examEnding}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {exam.teacherName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {exam.courseName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {exam.semesterName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {exam.className}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {exam.examTypeName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/educational-affairs/exams/exam-result/${exam.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar"
                          ? "تعديل"
                          : currentLanguage === "fr"
                            ? "Modifier"
                            : "view"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      >
                        {currentLanguage === "ar"
                          ? "حذف"
                          : currentLanguage === "fr"
                            ? "Supprimer"
                            : "Delete"}
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/educational-affairs/exams/${exam.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar"
                          ? "تعديل"
                          : currentLanguage === "fr"
                            ? "Modifier"
                            : "Edit"}
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {(data?.length == 0 || data == null) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "There is No Data"
                : currentLanguage === "ar"
                  ? "لا توجد بيانات"
                  : currentLanguage === "fr"
                    ? "Il n'y a pas de données"
                    : "There is No Data"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Exams;
