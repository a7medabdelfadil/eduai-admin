"use client"
import React from 'react';
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import { useGetAllStudentGradsQuery } from "@/features/Document-Management/certificatesApi";
import { useSelector } from "react-redux";
import { CalendarDays, GraduationCap, User, BookOpen } from "lucide-react";
import { RootState } from '@/GlobalRedux/store';
import { NumberDomain } from 'recharts/types/util/types';
interface ParamsType {
  params: {
    pointId: number;
  };
}

interface CourseGrade {
  courseId: number;
  courseName: string;
  grade: number | string;
}


const ViewPoint = ({ params }: ParamsType) => {
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
      nameEn: "Points",
      nameAr: "النقاط",
      nameFr: "Points",
      href: `/document-management/transcript/points`,
    },
    {
      nameEn: "View Student",
      nameAr: "عرض الطالب",
      nameFr: "Voir l'étudiant",
      href: `/document-management/transcript/points/${params.pointId}`,
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const { data, isLoading } = useGetAllStudentGradsQuery(params.pointId);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgSecondary">
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
          } p-6`}
      >
        {/* Student Information Section */}
        <div className="mb-8 rounded-lg bg-bgPrimary p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-secondary">
            <User className="h-6 w-6" />
            {currentLanguage === "ar" ? "معلومات الطالب" : "Student Information"}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">{currentLanguage === "ar" ? "رقم الطالب" : "Student ID"}</p>
                <p className="text-lg font-medium">{data?.data?.studentId}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">{currentLanguage === "ar" ? "اسم الطالب" : "Student Name"}</p>
                <p className="text-lg font-medium">{data?.data?.studentName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">{currentLanguage === "ar" ? "تاريخ الميلاد" : "Date of Birth"}</p>
                <p className="text-lg font-medium">{data?.data?.dateOfBirth}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">{currentLanguage === "ar" ? "الفصل الدراسي الأخير" : "Last Semester"}</p>
                <p className="text-lg font-medium">{data?.data?.lastSemester}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grades Section */}
        {data?.data?.gradesSummaries.map((semester: any, index: number) => (
          <div key={index} className="mb-8 rounded-lg bg-bgPrimary p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-secondary">
              <GraduationCap className="h-6 w-6" />
              {semester.semesterName} - {semester.studyLevel}
            </h2>

            <div className="overflow-hidden rounded-lg border border-borderPrimary">
              <div className="grid grid-cols-2 gap-4 bg-bgSecondary p-4 font-medium text-secondary">
                <div>{currentLanguage === "ar" ? "المادة" : "Course"}</div>
                <div>{currentLanguage === "ar" ? "الدرجة" : "Grade"}</div>
              </div>
              {(Object.values(semester.courseGrades) as CourseGrade[]).map((courseGrade, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-4 border-t border-borderPrimary p-4">
                  <div className="text-secondary">{courseGrade.courseName}</div>
                  <div className="font-medium text-secondary">{courseGrade.grade}</div>
                </div>
              ))}


              <div className="grid grid-cols-2 gap-4 border-t border-borderPrimary bg-bgSecondary p-4">
                <div className="font-medium text-secondary">
                  {currentLanguage === "ar" ? "المعدل التراكمي" : "Total GPA"}
                </div>
                <div className="font-medium text-secondary">{semester.totalGPA}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPoint;
