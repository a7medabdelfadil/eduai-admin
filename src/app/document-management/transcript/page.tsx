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
import SeeMoreButton from "@/components/SeeMoreButton";

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
    (state: RootState) => state.language,
  );
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const {
    data: studentsData,
    error,
    isLoading,
    refetch,
  } = useGetAllStudentsQuery({
    archived: "true",
    page: 0,
    size: 100000,
    graduated: "false",
  });

  const { data: semestersData, isLoading: semestersLoading } =
    useGetAllSemestersQuery(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const shouldSkip = !selectedSemester || !selectedStudent;
  const {
    data: coursesData,
    isFetching: isCoursesLoading,
    refetch: fetchCourses,
  } = useGetAllTranscriptCoursesQuery(
    shouldSkip
      ? skipToken
      : { studentId: selectedStudent, semesterId: selectedSemester },
  );

  const [visibleCount, setVisibleCount] = useState(20);

  const visibleCourses = coursesData?.data?.slice(0, visibleCount) || [];

  const translate = (en: string, ar: string, fr: string) => {
    return currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;
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
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Transcripts"
              : currentLanguage === "ar"
                ? "السجلات"
                : currentLanguage === "fr"
                  ? "Relevés de notes"
                  : "Transcripts"}
            {/* default */}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row flex-wrap gap-4">
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
          <Link
            href="/document-management/transcript/points"
            className="hover:text-blue-500 hover:underline"
          >
            {currentLanguage === "ar"
              ? "قائمة النقاط"
              : currentLanguage === "fr"
                ? "Liste des points"
                : "List Of Points"}
          </Link>
        </div>
        <div className="flex flex-col md:flex-row gap-4 flex-wrap mt-4">

          <select
            id="semester-select"
            className="w-[400px] rounded-xl border bg-bgPrimary border-borderPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
            value={selectedSemester || ""}
            onChange={e => setSelectedSemester(Number(e.target.value))}
          >
            <option value="" disabled className="text-secondary">
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
            className="h-[50px] w-[400px] rounded-xl border bg-bgPrimary border-borderPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
            value={selectedStudent || ""}
            onChange={e => setSelectedStudent(Number(e.target.value))}
          >
            <option value="" disabled className="text-secondary">
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
          <p className="mt-4 text-center text-lg font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "يرجى اختيار الطالب والفصل الدراسي"
              : currentLanguage === "fr"
                ? "Veuillez choisir un étudiant et un semestre"
                : "Please select both student and semester"}
          </p>
        )}

        {selectedStudent && !selectedSemester && (
          <p className="mt-4 text-center text-lg font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "يرجى اختيار الفصل الدراسي"
              : currentLanguage === "fr"
                ? "Veuillez choisir un semestre"
                : "Please select a semester"}
          </p>
        )}

        {!selectedStudent && selectedSemester && (
          <p className="mt-4 text-center text-lg font-semibold text-textPrimary">
            {currentLanguage === "ar"
              ? "يرجى اختيار الطالب"
              : currentLanguage === "fr"
                ? "Veuillez choisir un étudiant"
                : "Please select a student"}
          </p>
        )}
        {selectedSemester && coursesData && (
          <div className="max-w-screen overflow-x-hidden">

            <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg mt-4">

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translate("Course Name", "اسم الدورة", "Nom du cours")}</TableHead>
                    <TableHead>{translate("Code", "الكود", "Code")}</TableHead>
                    <TableHead>{translate("Level", "مستوى", "Niveau")}</TableHead>
                    <TableHead>{translate("Language", "لغة", "Langue")}</TableHead>
                    <TableHead>{translate("System Name", "اسم النظام التعليمي", "Nom du système éducatif")}</TableHead>
                    <TableHead>{translate("Secondary School", "قسم المدرسة الثانوية", "Écoles secondaires")}</TableHead>
                    <TableHead>{translate("Sub Department", "القسم الفرعي", "Sous-département")}</TableHead>
                    <TableHead>{translate("View", "عرض", "Voir")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isCoursesLoading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center font-semibold py-6">
                        {translate("No data available", "لا توجد بيانات متاحة", "Aucune donnée disponible")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleCourses.map((course: any, index: number) => (
                      <TableRow key={index} data-index={index}>
                        <TableCell>{course.courseResponse.name}</TableCell>
                        <TableCell>{course.courseResponse.code}</TableCell>
                        <TableCell>{course.courseResponse.level}</TableCell>
                        <TableCell>{course.courseResponse.language}</TableCell>
                        <TableCell>{course.courseResponse.eduSystemName}</TableCell>
                        <TableCell>{course.courseResponse.secondarySchoolDepartment}</TableCell>
                        <TableCell>{course.courseResponse.subDepartment}</TableCell>
                        <TableCell>
                          <Link
                            href={`/document-management/transcript/${course.courseSemesterRegistrationId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {translate("View", "عرض", "Voir")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {visibleCount < (coursesData?.data?.length || 0) && (
                <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
              )}
            </div>
          </div>

        )}
      </Container>

    </>
  );
};

export default Transcript;
