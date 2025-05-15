"use client"
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { useGetAllGradeCourseQuery } from "@/features/Document-Management/certificatesApi";
import { RootState } from "@/GlobalRedux/store";
import { useState } from "react";
import { useSelector } from "react-redux";

interface ParamsType {
  params: {
    courseId: number;
  };
}

const Course = ({ params }: ParamsType) => {
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
      href: `/document-management/transcript/${params.courseId}`,
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
  );
  const { data, isLoading } = useGetAllGradeCourseQuery(params.courseId);
  const filteredData = data?.data?.filter((course: any) =>
    course.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading)
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
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-secondary/50"
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
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
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
        </div>

        <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
          <thead className="bg-thead text-xs uppercase text-textPrimary">
            <tr>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "اسم الطالب"
                  : currentLanguage === "fr"
                    ? "Nom de l'étudiant"
                    : "Student Name"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "اسم الصف"
                  : currentLanguage === "fr"
                    ? "Nom de la classe"
                    : "Class Name"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "اسم الدورة"
                  : currentLanguage === "fr"
                    ? "Nom du cours"
                    : "Course Name"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "المعامل"
                  : currentLanguage === "fr"
                    ? "Coefficient"
                    : "Coefficient"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "الامتحان الأول"
                  : currentLanguage === "fr"
                    ? "Premier examen"
                    : "First Exam Score"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "الامتحان الثاني"
                  : currentLanguage === "fr"
                    ? "Deuxième examen"
                    : "Second Exam Score"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "الامتحان الثالث"
                  : currentLanguage === "fr"
                    ? "Troisième examen"
                    : "Third Exam Score"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "الامتحان الرابع"
                  : currentLanguage === "fr"
                    ? "Quatrième examen"
                    : "Fourth Exam Score"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "الأنشطة المتكاملة"
                  : currentLanguage === "fr"
                    ? "Activités intégrées"
                    : "Integrated Activities"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "النقاط"
                  : currentLanguage === "fr"
                    ? "Points"
                    : "Points"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "التقييم المستمر"
                  : currentLanguage === "fr"
                    ? "Évaluation continue"
                    : "Continuous Assessment"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3 text-center">
                {currentLanguage === "ar"
                  ? "المعدل التراكمي"
                  : currentLanguage === "fr"
                    ? "Moyenne cumulative"
                    : "GPA"}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((course: any, index: number) => (
              <tr
                key={index}
                className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  {course.studentName || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {course.className || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {course.courseGradeReportDTO.courseName || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.coefficient || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.firstExamScore || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.secondExamScore || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.thirdExamScore || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.fourthExamScore || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.integratedActivitiesScore || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.points || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.continuousAssessment || "-"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-center">
                  {course.courseGradeReportDTO.gpa || "-"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        {(filteredData.length == 0 || data == null) && (
          <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
            {currentLanguage === "en"
              ? "There is No Data"
              : currentLanguage === "ar"
                ? "لا توجد بيانات"
                : "Aucune donnée"}
          </div>
        )}
      </div>
    </>
  );
}

export default Course;
