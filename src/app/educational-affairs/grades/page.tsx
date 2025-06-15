/* eslint-disable @next/next/no-img-element */
"use client";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { useGetAllGradesQuery } from "@/features/Acadimic/courseApi";
import {
  useGetAllSemestersByYearQuery,
  useGetAllAcadimicYearQuery,
} from "@/features/Organization-Setteings/semesterApi";
import { useGetAllStudentsQuery } from "@/features/User-Management/studentApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";

const Grads = () => {
  const breadcrumbs = [
    { nameEn: "Academic", nameAr: "أكاديمي", nameFr: "Académique", href: "/" },
    {
      nameEn: "Educational Affairs",
      nameAr: "الشئون التعليمية",
      nameFr: "Affaires éducatives",
      href: "/educational-affairs",
    },
    {
      nameEn: "Grades",
      nameAr: "الدرجات",
      nameFr: "Notes",
      href: "/educational-affairs/grads",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [semesterSelectTouched, setSemesterSelectTouched] = useState(false);

  const { data: students, isLoading: isStudents } = useGetAllStudentsQuery({
    archived: "false",
    page: 0,
    size: 1000000,
    graduated: "false",
  });

  const { data: years, isLoading: isYear } = useGetAllAcadimicYearQuery(null);

  const { data: semesters, isLoading: isSemester } =
    useGetAllSemestersByYearQuery(selectedAcademicYear || skipToken);

  const { data: grades, isLoading: isGrades } = useGetAllGradesQuery(
    selectedStudent && selectedSemester
      ? { semesterId: selectedSemester, studentId: selectedStudent }
      : skipToken,
  );

  if (loading || isStudents || isSemester || isGrades || isYear)
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
        <div className="mb-5 flex justify-between gap-5 max-[1150px]:grid max-[1150px]:justify-center">
          {/* Student Select */}
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="h-full w-[400px] rounded-xl border bg-bgPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
          >
            <option value="">
              {currentLanguage === "en"
                ? "Select Student"
                : currentLanguage === "ar"
                  ? "اختر الطالب"
                  : "Sélectionner Étudiant"}
            </option>
            {students?.data.content.map((student: any) => (
              <option key={student.id} value={student.id ?? ""}>
                {String(student.name)}
              </option>
            ))}
          </select>

          {/* Academic Year Select */}
          <select
            value={selectedAcademicYear}
            onChange={e => {
              setSelectedAcademicYear(e.target.value);
              setSemesterSelectTouched(false);
              setSelectedSemester(""); // Reset selected semester when academic year changes
            }}
            className="h-full w-[400px] rounded-xl border bg-bgPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
          >
            <option value="">
              {currentLanguage === "en"
                ? "Select Academic Year"
                : currentLanguage === "ar"
                  ? "اختر العام الدراسي"
                  : "Sélectionner l'année académique"}
            </option>
            {years?.data.map((year: any) => (
              <option key={year.id} value={year.id ?? ""}>
                {year.name}
              </option>
            ))}
          </select>

          {/* Semesters Select */}
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            className="h-full w-[400px] rounded-xl border bg-bgPrimary px-4 py-3 text-[18px] text-textSecondary outline-none max-[458px]:w-[350px]"
            disabled={!selectedAcademicYear}
            onFocus={() => {
              if (!selectedAcademicYear) {
                setSemesterSelectTouched(true);
              }
            }}
          >
            <option value="">
              {currentLanguage === "en"
                ? "Select Semester"
                : currentLanguage === "ar"
                  ? "اختر الفصل الدراسي"
                  : "Sélectionner Semestre"}
            </option>
            {semesters?.data.map((semester: any) => (
              <option key={semester.id} value={semester.id ?? ""}>
                {semester.name}
              </option>
            ))}
          </select>

          {/* Error Message */}
          {semesterSelectTouched && !selectedAcademicYear && (
            <p className="text-red-500">
              {currentLanguage === "en"
                ? "Please select academic year first"
                : currentLanguage === "ar"
                  ? "الرجاء اختيار العام الدراسي أولاً"
                  : "Veuillez d'abord sélectionner l'année académique"}
            </p>
          )}
        </div>

        {grades && (
          <div className="relative overflow-auto shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Subject"
                      : currentLanguage === "ar"
                        ? "المادة"
                        : "Sujet"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "First Assignment"
                      : currentLanguage === "ar"
                        ? "التكليف الأول"
                        : "Première évaluation"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Second Assignment"
                      : currentLanguage === "ar"
                        ? "التكليف الثاني"
                        : "Deuxième évaluation"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Third Assignment"
                      : currentLanguage === "ar"
                        ? "التكليف الثالث"
                        : "Troisième évaluation"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Fourth Assignment"
                      : currentLanguage === "ar"
                        ? "التكليف الرابع"
                        : "Quatrième évaluation"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Integrated Activities"
                      : currentLanguage === "ar"
                        ? "الأنشطة المندمجة"
                        : "Activités Intégrées"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Points"
                      : currentLanguage === "ar"
                        ? "النقاط"
                        : "Points"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Coefficients"
                      : currentLanguage === "ar"
                        ? "معاملات"
                        : "Coefficients"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "GPA"
                      : currentLanguage === "ar"
                        ? "المعدل"
                        : "Moyenne"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isGrades ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !grades?.courses?.length ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center font-medium">
                      {currentLanguage === "ar"
                        ? "لا توجد بيانات"
                        : currentLanguage === "fr"
                          ? "Aucune donnée disponible"
                          : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  grades.courses.map((course: any, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{course.courseName}</TableCell>
                      <TableCell>{course.firstExamScore ?? "-"}</TableCell>
                      <TableCell>{course.secondExamScore ?? "-"}</TableCell>
                      <TableCell>{course.thirdExamScore ?? "-"}</TableCell>
                      <TableCell>{course.fourthExamScore ?? "-"}</TableCell>
                      <TableCell>
                        {course.integratedActivitiesScore ?? "-"}
                      </TableCell>
                      <TableCell>{course.points}</TableCell>
                      <TableCell>{course.coefficient}</TableCell>
                      <TableCell>{course.gpa}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

              <tfoot className="text-sm font-semibold">
                <TableRow>
                  <TableCell colSpan={6}>
                    {currentLanguage === "en"
                      ? "Total Coefficient"
                      : currentLanguage === "ar"
                        ? "إجمالي المعامل"
                        : "Total des Coefficients"}
                  </TableCell>
                  <TableCell colSpan={3}>{grades.totalCoefficient}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6}>
                    {currentLanguage === "en"
                      ? "Semester Average"
                      : currentLanguage === "ar"
                        ? "معدل الفصل"
                        : "Moyenne du Semestre"}
                  </TableCell>
                  <TableCell colSpan={3}>
                    {grades.averageOfThisSemester ?? "-"}
                  </TableCell>
                </TableRow>
              </tfoot>
            </Table>
          </div>
        )}
      </div>
    </>
  );
};

export default Grads;
