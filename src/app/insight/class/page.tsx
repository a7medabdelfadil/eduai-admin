"use client";

import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { Skeleton } from "@/components/Skeleton";
import { useGetClassPerformanceQuery } from "@/features/Infrastructure/classApi";
import { useGetAllLevelsQuery } from "@/features/signupApi";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";

const Class = () => {
  const breadcrumbs = [
    {
      nameEn: "Ai Insights",
      nameAr: "رؤى الذكاء الاصطناعي",
      nameFr: "Perspectives de l'IA",
      href: "/",
    },
    {
      nameEn: "School Comparisons",
      nameAr: "مقارنات المدارس",
      nameFr: "Comparaisons des écoles",
      href: "/insight/class",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
  );

  const [selectedLevel, setSelectedLevel] = useState("GRADE1");
  const [selectedPeriod, setSelectedPeriod] = useState("YEAR");

  const { data, isLoading } = useGetClassPerformanceQuery({
    level: selectedLevel,
    period: selectedPeriod,
  });

  const { data: levelsData, isLoading: isGradesLoading } = useGetAllLevelsQuery(null);

  const className = data?.data?.classes?.[0]?.className;
  const classAvg = data?.data?.classes?.[0]?.averageGrade || 0;
  const courseList = className ? data?.data?.courses?.[className] || [] : [];

  const barData = [
    {
      name: className,
      value: classAvg,
    },
  ];

  const horizontalData = courseList.map((course: any) => ({
    name: course.courseName,
    value: course.averageGrade,
  }));

  if (loading || isLoading) {
    return (
      <Container>
        <BreadCrumbs breadcrumbs={breadcrumbs} />
        <div className="grid overflow-x-auto">
          <div className="justify-left mb-5 ml-4 mt-10 flex flex-wrap gap-5 overflow-x-auto text-nowrap text-[20px] font-semibold">
            <Link className="hover:text-blue-500 hover:underline" href="/insight">
              {currentLanguage === "en"
                ? "Student Performance"
                : currentLanguage === "ar"
                  ? "أداء الطالب"
                  : currentLanguage === "fr"
                    ? "Performance de l'étudiant"
                    : "Student Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/school">
              {currentLanguage === "en"
                ? "School Performance"
                : currentLanguage === "ar"
                  ? "أداء المدرسة"
                  : currentLanguage === "fr"
                    ? "Performance de l'école"
                    : "School Performance"}
            </Link>
            <Link href="/insight/class" className="text-blue-500 underline">
              {currentLanguage === "en"
                ? "Class Performance"
                : currentLanguage === "ar"
                  ? "أداء الفصل"
                  : currentLanguage === "fr"
                    ? "Performance de la classe"
                    : "Class Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/ml-exam">
              {currentLanguage === "en"
                ? "ML Exam Performance"
                : currentLanguage === "ar"
                  ? "أداء اختبار تعلم الآلة"
                  : currentLanguage === "fr"
                    ? "Performance de l'examen ML"
                    : "ML Exam Performance"}
            </Link>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Container>
    );
  }


  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="grid overflow-x-auto">
          <div className="justify-left mb-5 ml-4 mt-10 flex flex-wrap gap-5 overflow-x-auto text-nowrap text-[20px] font-semibold">
            <Link className="hover:text-blue-500 hover:underline" href="/insight">
              {currentLanguage === "en"
                ? "Student Performance"
                : currentLanguage === "ar"
                  ? "أداء الطالب"
                  : currentLanguage === "fr"
                    ? "Performance de l'étudiant"
                    : "Student Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/school">
              {currentLanguage === "en"
                ? "School Performance"
                : currentLanguage === "ar"
                  ? "أداء المدرسة"
                  : currentLanguage === "fr"
                    ? "Performance de l'école"
                    : "School Performance"}
            </Link>
            <Link href="/insight/class" className="text-blue-500 underline">
              {currentLanguage === "en"
                ? "Class Performance"
                : currentLanguage === "ar"
                  ? "أداء الفصل"
                  : currentLanguage === "fr"
                    ? "Performance de la classe"
                    : "Class Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/ml-exam">
              {currentLanguage === "en"
                ? "ML Exam Performance"
                : currentLanguage === "ar"
                  ? "أداء اختبار تعلم الآلة"
                  : currentLanguage === "fr"
                    ? "Performance de l'examen ML"
                    : "ML Exam Performance"}
            </Link>
          </div>
        </div>

        <div className="space-y-8 p-4 rounded-xl bg-bgPrimary shadow-md">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-textPrimary">Class Performance</h2>

            <div className="flex gap-4">
              {/* Select Period */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-md border border-borderPrimary bg-background px-3 py-2 text-sm text-textPrimary shadow-sm focus:outline-none"
              >
                <option value="YEAR">Year</option>
                <option value="SEMESTER">Semester</option>
                <option value="MONTH">Month</option>
                <option value="WEEK">Week</option>
              </select>

              {/* Select Grade */}
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="rounded-md border border-borderPrimary bg-background px-3 py-2 text-sm text-textPrimary shadow-sm focus:outline-none"
              >
                {levelsData?.data &&
                  Object.entries(levelsData.data).map(([key, value]) => (
                    <option key={key} value={key}>
                      {String(value)}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} barSize={30}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg, #0f172a)",
                  borderRadius: 8,
                  border: "none",
                  color: "var(--tooltip-text, white)",
                  fontSize: 12,
                }}
                cursor={{ fill: "transparent" }}
              />              <Bar dataKey="value" fill="#06b6d4" radius={[10, 10, 0, 0]}>
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div>
            <h3 className="font-medium text-md mb-2">{className}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={horizontalData}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg, #0f172a)",
                    borderRadius: 8,
                    border: "none",
                    color: "var(--tooltip-text, white)",
                    fontSize: 12,
                  }}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  dataKey="value"
                  fill="#06b6d4"
                  radius={[0, 10, 10, 0]} // full rounded
                  barSize={30} // smaller bar height
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Class;
