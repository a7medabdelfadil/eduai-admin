"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useGetAllTranscriptCoursesQuery } from "@/features/Document-Management/certificatesApi";
import { useGetAllSemestersQuery } from "@/features/Organization-Setteings/semesterApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import { Skeleton } from "@/components/Skeleton";

const Transcript = () => {
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
      nameEn: "Transcript",
      nameAr: "سجل الدرجات",
      nameFr: "Relevé de notes",
      href: "/document-management/transcript",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
  );
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const { data: studentsData, error, isLoading, refetch } = useGetAllStudentsQuery({
    archived: "true",
    page: 0,
    size: 100000,
    graduated: "false"
  });

  console.log('studentsData', studentsData);
  const { data: semestersData, isLoading: semestersLoading } = useGetAllSemestersQuery(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const shouldSkip = !selectedSemester || !selectedStudent;
  const { data: coursesData, isFetching: isCoursesLoading, refetch: fetchCourses } = useGetAllTranscriptCoursesQuery(
    shouldSkip ? skipToken : { studentId: selectedStudent, semesterId: selectedSemester }
  );




  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semesterId = Number(event.target.value);
    setSelectedSemester(semesterId);
  };

useEffect(() => {
  if (selectedStudent && selectedSemester) {
    fetchCourses();
  }
}, [selectedStudent, selectedSemester]);


  if (loading || semestersLoading)
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
          } justify-left mb-4 ml-4 mt-5 flex gap-5 text-[20px] font-medium`}
      >
        <Link
          href="/document-management/transcript"
          className="text-blue-500 underline"
        >
          {currentLanguage === "ar"
            ? "قائمة الدورات"
            : currentLanguage === "fr"
              ? "Liste des cours"
              : "Course List"}
        </Link>
        <Link href="/document-management/transcript/points">
          {currentLanguage === "ar"
            ? "قائمة النقاط"
            : currentLanguage === "fr"
              ? "Liste des points"
              : "List Of Points"}
        </Link>
      </div>
      <div dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
          ? booleanValue ? "lg:mr-[100px]" : "lg:mr-[270px]"
          : booleanValue ? "lg:ml-[100px]" : "lg:ml-[270px]"
          } justify-left mb-4 ml-4 mt-5 flex gap-5 text-[20px] font-medium`}>

        <select
          id="semester-select"
          className="h-full w-[400px] rounded-xl border bg-bgPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
          value={selectedSemester || ""}
          onChange={(e) => setSelectedSemester(Number(e.target.value))}
        >
          <option value="" disabled>
            {currentLanguage === "ar"
              ? "اختر فصلًا"
              : currentLanguage === "fr"
                ? "Choisissez un semestre"
                : "Choose a Semester"}
          </option>
          {semestersData?.data?.content.map((semester: any) => (
            <option key={semester.id} value={semester.id}>
              {semester.name}
            </option>
          ))}
        </select>

        <select
          id="student-select"
          className="h-full w-[400px] rounded-xl border bg-bgPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
          value={selectedStudent || ""}
          onChange={(e) => setSelectedStudent(Number(e.target.value))}
        >
          <option value="" disabled>
            {currentLanguage === "ar"
              ? "اختر طالبًا"
              : currentLanguage === "fr"
                ? "Choisissez un étudiant"
                : "Choose a Student"}
          </option>
          {studentsData?.data?.content?.map((student: any) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>



      {!selectedStudent && !selectedSemester && (
        <p className="mt-4 text-textPrimary text-center text-lg font-semibold">
          {currentLanguage === "ar"
            ? "يرجى اختيار الطالب والفصل الدراسي"
            : currentLanguage === "fr"
              ? "Veuillez choisir un étudiant et un semestre"
              : "Please select both student and semester"}
        </p>
      )}

      {selectedStudent && !selectedSemester && (
        <p className="mt-4  text-textPrimary text-center text-lg font-semibold">
          {currentLanguage === "ar"
            ? "يرجى اختيار الفصل الدراسي"
            : currentLanguage === "fr"
              ? "Veuillez choisir un semestre"
              : "Please select a semester"}
        </p>
      )}

      {!selectedStudent && selectedSemester && (
        <p className="mt-4  text-textPrimary text-center text-lg font-semibold">
          {currentLanguage === "ar"
            ? "يرجى اختيار الطالب"
            : currentLanguage === "fr"
              ? "Veuillez choisir un étudiant"
              : "Please select a student"}
        </p>
      )}
      {selectedSemester && coursesData && (
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
          <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "اسم الدورة"
                    : currentLanguage === "fr"
                      ? "Nom du cours"
                      : "Course Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الكود"
                    : currentLanguage === "fr"
                      ? "Code"
                      : "Code"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "مستوى"
                    : currentLanguage === "fr"
                      ? "niveau"
                      : "level"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "لغة"
                    : currentLanguage === "fr"
                      ? "langue"
                      : "language"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "اسم النظام التعليمي"
                    : currentLanguage === "fr"
                      ? "Nom du système éducatif"
                      : "System Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "قسم المدرسة الثانوية"
                    : currentLanguage === "fr"
                      ? "écoles secondaires"
                      : "secondary School"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "القسم الفرعي"
                    : currentLanguage === "fr"
                      ? "sous-département"
                      : "sub Department "}
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
              {isCoursesLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="border-b border-borderPrimary bg-bgPrimary">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <td key={i} className="px-6 py-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : coursesData?.data?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-lg font-semibold text-textPrimary">
                    {currentLanguage === "ar"
                      ? "لا توجد بيانات متاحة"
                      : currentLanguage === "fr"
                        ? "Aucune donnée disponible"
                        : "No data available"}
                  </td>
                </tr>
              ) : (
                coursesData?.data?.map((course: any) => (
                  <tr
                    key={course.courseSemesterRegistrationId}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                  >
                    <td className="whitespace-nowrap px-6 py-4">{course.courseResponse.name}</td>
                    <td className="whitespace-nowrap px-6 py-4">{course.courseResponse.code}</td>
                    <td className="whitespace-nowrap px-6 py-4">{course.courseResponse.level}</td>
                    <td className="whitespace-nowrap px-6 py-4">{course.courseResponse.language}</td>
                    <td className="whitespace-nowrap px-6 py-4">{course.courseResponse.eduSystemName}</td>
                    <td className="whitespace-nowrap px-6 py-4">{course.courseResponse.secondarySchoolDepartment}</td>
                    <td className="whitespace-nowrap px-6 py-4">{course.courseResponse.subDepartment}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/document-management/transcript/${course.courseSemesterRegistrationId}`}
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
      )}
    </>
  );
};

export default Transcript;
