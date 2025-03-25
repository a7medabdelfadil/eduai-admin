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

  const { data: semestersData, isLoading: semestersLoading } = useGetAllSemestersQuery(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const { data: coursesData, refetch: fetchCourses } = useGetAllTranscriptCoursesQuery(selectedSemester || skipToken);

  console.log(selectedSemester);
  

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semesterId = Number(event.target.value);
    setSelectedSemester(semesterId);
  };

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
        className={`${
          currentLanguage === "ar"
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
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
            ? "lg:ml-[100px]"
            : "lg:ml-[270px]"
        } justify-left mb-4 ml-4 mt-5 flex gap-5 text-[20px] font-medium`}>
        <select
          id="semester-select"
          className="h-full w-[400px] rounded-xl border bg-bgPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
          value={selectedSemester || ""}
          onChange={handleSemesterChange}
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
      </div>
      {selectedSemester && coursesData && (
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
              {coursesData.data.map((course: any, index: number) => (
                <tr
                  key={course.courseSemesterRegistrationId}
                  className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.courseResponse.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.courseResponse.code}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.courseResponse.level}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.courseResponse.language}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.courseResponse.eduSystemName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.courseResponse.secondarySchoolDepartment}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {course.courseResponse.subDepartment}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/document-management/transcript/${course.courseSemesterRegistrationId}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Transcript;
