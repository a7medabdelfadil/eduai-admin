/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react"; // Import useState and useEffect hooks
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner";
import {
  useDeleteExamTypeMutation,
  useGetExamTypeByCourseIdQuery,
} from "@/features/Acadimic/examsApi";
import { useGetAllCoursesQuery } from "@/features/Acadimic/courseApi";
import Container from "@/components/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";

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
  const { data: coursesData, isLoading: isCoursesLoading } =
    useGetAllCoursesQuery(null);
  const {
    data: exams,
    isLoading: isExamsLoading,
    refetch: refetchExam,
  } = useGetExamTypeByCourseIdQuery(
    selectedCourseId || "0", // Use "0" as default if no course selected
    { skip: !selectedCourseId }, // Skip the query if no course is selected
  );

  const [deleteExamType, { isLoading: isDeleting }] =
    useDeleteExamTypeMutation();

  const handleDelete = async (id: any) => {
    try {
      await deleteExamType(id).unwrap();
      toast.success(`Semester with ID ${id} deleted successfully`);
      refetchExam();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
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
      <Container>
        <div className="flex flex-col justify-between gap-4 text-center md:flex-row">
          {/* Course selection dropdown */}
          <div className="min-w-72 flex-1 md:min-w-80">
            <label
              htmlFor="course-select"
              className="mb-2 block text-left text-sm font-medium text-textPrimary"
            >
              {currentLanguage === "ar"
                ? "اختر المسار"
                : currentLanguage === "fr"
                  ? "Sélectionnez le cours"
                  : "Select Course"}
            </label>
            <select
              id="course-select"
              className="block w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
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

          <div className="min-w-72 flex-1 md:min-w-80">
            <label
              htmlFor="icon"
              className="mb-2 block text-left text-sm font-medium text-textPrimary"
            >
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
        {selectedCourseId && (
          // Only show table if a course is selected
          <>
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {currentLanguage === "ar"
                        ? "اسم الامتحان"
                        : currentLanguage === "fr"
                          ? "Nom de l'examen"
                          : "Exam Name"}
                    </TableHead>
                    <TableHead>
                      {currentLanguage === "ar"
                        ? "درجة الامتحان"
                        : currentLanguage === "fr"
                          ? "Note de l'examen"
                          : "Exam Grade"}
                    </TableHead>
                    <TableHead>
                      {currentLanguage === "ar"
                        ? "درجة النجاح"
                        : currentLanguage === "fr"
                          ? "Note de passage"
                          : "Passing Grade"}
                    </TableHead>
                    <TableHead>
                      {currentLanguage === "ar"
                        ? "المستوى الدراسي"
                        : currentLanguage === "fr"
                          ? "Niveau d'étude"
                          : "Study Level"}
                    </TableHead>
                    <TableHead>
                      {currentLanguage === "ar"
                        ? "الإجراء"
                        : currentLanguage === "fr"
                          ? "Action"
                          : "Action"}
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isCoursesLoading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        {Array(5)
                          .fill(0)
                          .map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          ))}
                      </TableRow>
                    ))
                  ) : exams?.data?.length > 0 ? (
                    exams.data.map((exam: any, index: number) => (
                      <TableRow key={index} data-index={index}>
                        <TableCell className="font-medium">
                          {exam.name}
                        </TableCell>
                        <TableCell>{exam.examGrade}</TableCell>
                        <TableCell>{exam.passingGrade}</TableCell>
                        <TableCell>{exam.studyLevel}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-6 text-center text-gray-500"
                      >
                        {currentLanguage === "en"
                          ? "No exams found for this course"
                          : currentLanguage === "ar"
                            ? "لا توجد امتحانات لهذا المسار"
                            : "Aucun examen trouvé pour ce cours"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Exams;
