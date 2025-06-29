"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import GradeReportCard from "@/components/GradeReportCard";
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

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const { data, isLoading } = useGetAllGradeCourseQuery(params.courseId);
  const filteredData = data?.data?.filter((course: any) =>
    course.studentName?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
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
                onChange={e => setSearchTerm(e.target.value)}
                value={searchTerm}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredData?.map((item: any, index: any) => (
            <GradeReportCard
              key={index}
              studentName={item.studentName}
              className={item.className}
              courseName={item.courseGradeReportDTO.courseName}
              points={item.courseGradeReportDTO.points}
              continuousAssessment={item.courseGradeReportDTO.continuousAssessment}
              gpa={item.courseGradeReportDTO.gpa}
            />
          ))}
        </div>


      </Container>
    </>
  );
};

export default Course;
