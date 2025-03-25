/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react"; // Import useState and useEffect hooks
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner";
import { useDeleteExamTypeMutation, useGetExamTypeByCourseIdQuery } from "@/features/Acadimic/examsApi";
import { useGetAllCoursesQuery } from "@/features/Acadimic/courseApi";

const Exams = () => {
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
    {
      nameEn: "Exams",
      nameAr: "الإمتحانات",
      nameFr: "Examens",
      href: "/organization-setting/exams",
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(""); // State to store selected course ID
  const booleanValue = useSelector((state: RootState) => state.boolean.value); // sidebar
  const { data: coursesData, isLoading: isCoursesLoading } = useGetAllCoursesQuery(null);
  const { data: exams, isLoading: isExamsLoading, refetch: refetchExam } = useGetExamTypeByCourseIdQuery(
    selectedCourseId || "0", // Use "0" as default if no course selected
    { skip: !selectedCourseId } // Skip the query if no course is selected
  );
  const [selectAll, setSelectAll] = useState(false); // State to track whether select all checkbox is checked

  const [deleteExamType, { isLoading: isDeleting }] =
    useDeleteExamTypeMutation();

  const handleDelete = async (id: any) => {
    console.log(id);
    
    try {
      await deleteExamType(id).unwrap();
      toast.success(`Semester with ID ${id} deleted successfully`);
      refetchExam();
    } catch (err: any) {
      toast.error(err.data.statusMsg);
    }
  };
  // Function to handle click on select all checkbox
  const handleSelectAll = () => {
    setSelectAll(!selectAll); // Toggle select all state
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    ); // Select all checkboxes except select all checkbox
    checkboxes.forEach(checkbox => {
      checkbox.checked = !selectAll; // Set checked state of each checkbox based on select all state
    });
  };

  // Handle course selection change
  const handleCourseChange = (e: any) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
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
        <div className="flex flex-col md:flex-row justify-between text-center gap-4">
          {/* Course selection dropdown */}
          <div className="flex-1 min-w-72 md:min-w-80">
            <label 
              htmlFor="course-select" 
              className="block mb-2 text-sm font-medium text-textPrimary text-left"
            >
              {currentLanguage === "ar"
                ? "اختر المسار"
                : currentLanguage === "fr"
                  ? "Sélectionnez le cours"
                  : "Select Course"}
            </label>
            <select
              id="course-select"
              className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              value={selectedCourseId}
              onChange={handleCourseChange}
            >
              <option value="">
                {currentLanguage === "ar"
                  ? "اختر المسار"
                  : currentLanguage === "fr"
                    ? "Sélectionnez le cours"
                    : "Select Course"}
              </option>
              {coursesData?.data?.content?.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.level}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-72 md:min-w-80">
            <label htmlFor="icon" className="block mb-2 text-sm font-medium text-textPrimary text-left">
              {currentLanguage === "ar"
                ? "بحث"
                : currentLanguage === "fr"
                  ? "Recherche"
                  : "Search"}
            </label>
            <div className="relative">
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

          <div className="flex items-end justify-center">
            <Link
              href="/organization-setting/exams/add-exam"
              className="mx-3 mb-0 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة نوع امتحان"
                : currentLanguage === "fr"
                  ? "Ajouter un type d'examen"
                  : "Add Exam Type"}
            </Link>
          </div>
        </div>

        {/* Show loading state while fetching exams */}
        {isExamsLoading ? (
          <div className="flex justify-center my-8">
            <Spinner />
          </div>
        ) : selectedCourseId ? (
          // Only show table if a course is selected
          <>
            <div className="mt-6">
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
                        ? "اسم الامتحان"
                        : currentLanguage === "fr"
                          ? "Nom de l'examen"
                          : "Exam Name"}
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                      {currentLanguage === "ar"
                        ? "درجة الامتحان"
                        : currentLanguage === "fr"
                          ? "Note de l'examen"
                          : "Exam Grade"}
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                      {currentLanguage === "ar"
                        ? "درجة النجاح"
                        : currentLanguage === "fr"
                          ? "Note de passage"
                          : "Passing Grade"}
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                      {currentLanguage === "ar"
                        ? "المستوى الدراسي"
                        : currentLanguage === "fr"
                          ? "Niveau d'étude"
                          : "Study Level"}
                    </th>
                    <th scope="col" className="whitespace-nowrap px-6 py-3">
                      {currentLanguage === "ar"
                        ? "الإجراء"
                        : currentLanguage === "fr"
                          ? "Action"
                          : "Action"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {exams?.data?.length > 0 ? (
                    exams.data.map((exam: any, index: number) => (
                      <tr key={index} className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input
                              id={`checkbox-table-search-${index}`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                        >
                          {exam.name}
                        </th>
                        <td className="whitespace-nowrap px-6 py-4">{exam.examGrade}</td>
                        <td className="whitespace-nowrap px-6 py-4">{exam.passingGrade}</td>
                        <td className="whitespace-nowrap px-6 py-4">{exam.studyLevel}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {/* <Link
                            href={`/organization-setting/exams/edit-exam/${exam.examTypeId}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {currentLanguage === "ar"
                              ? "تعديل"
                              : currentLanguage === "fr"
                                ? "Modifier"
                                : "Edit"}
                          </Link> */}
                          <button
                           disabled={isDeleting}
                           onClick={() => handleDelete(exam.examTypeId)}
                        className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      >
                        {currentLanguage === "ar"
                          ? "حذف"
                          : currentLanguage === "fr"
                            ? "Supprimer"
                            : "Delete"}
                      </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">
                        {currentLanguage === "en"
                          ? "No exams found for this course"
                          : currentLanguage === "ar"
                            ? "لا توجد امتحانات لهذا المسار"
                            : "Aucun examen trouvé pour ce cours"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          // Show message to select a course if none selected
          <div className="flex justify-center my-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-center text-[18px] font-semibold text-gray-500">
              {currentLanguage === "en"
                ? "Please select a course to view exams"
                : currentLanguage === "ar"
                  ? "الرجاء اختيار مسار لعرض الامتحانات"
                  : "Veuillez sélectionner un cours pour afficher les examens"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Exams;
