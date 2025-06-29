"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
  Tooltip,
  Legend,
  YAxis,
  ResponsiveContainer,   // ✅ NEW
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import {
  useAverageGradesAtSchoolQuery,
  useAverageAttendanceQuery,
  useTopStudentsInClassQuery,
} from "@/features/Acadimic/scheduleApi";
import { useGetAllClasssQuery } from "@/features/Infrastructure/classApi";
import Container from "@/components/Container";

const chartConfig = {
  desktop: { label: "My school", color: "#e23670" },
  mobile: { label: "Another school", color: "#2560d4" },
};

const chartConfig2 = {
  desktop: { label: "Desktop", color: "#e23670" },
  mobile: { label: "Mobile", color: "#2560d4" },
};

function InsightPage() {
  const { data, isLoading } = useAverageGradesAtSchoolQuery(null);
  const { data: averageAttendance, isLoading: isAverage } =
    useAverageAttendanceQuery(null);
  const [classroomId, setClassroomId] = useState<string | null>(null);
  const { data: classes, isLoading: isClassing } = useGetAllClasssQuery(null);
  const { data: strugglingStudents, isLoading: isStudentsLoading } =
    useTopStudentsInClassQuery(
      { classRoom: classroomId },
      { skip: classroomId === null },
    );

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  // Transform averageAttendance data for the chart
  const transformedAttendanceData = averageAttendance
    ? Object.keys(averageAttendance[0].MonthsAttendance).map(month => ({
      month,
      KINDERGARTEN: averageAttendance[0].MonthsAttendance[month],
      PRIMARY: averageAttendance[1].MonthsAttendance[month],
      PREPARATORY: averageAttendance[2].MonthsAttendance[month],
      SECONDARY: averageAttendance[3].MonthsAttendance[month],
    }))
    : [];

  interface Student {
    studentName: string;
    averageGrade: number;
    attendanceRate: number;
  }

  // Transform struggling students data for the chart
  const chartData3 =
    strugglingStudents && classroomId
      ? strugglingStudents.map((student: Student) => ({
        name: student.studentName,
        grade: student.averageGrade,
        attendance: student.attendanceRate,
      }))
      : [];

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const breadcrumbs = [
    {
      nameEn: "Ai Insights",
      nameAr: "تحليلات الذكاء الاصطناعي",
      nameFr: "Analyses IA",
      href: "/",
    },
    {
      nameEn: "School Comparisons",
      nameAr: "مقارنات التقدم",
      nameFr: "Comparaisons des progrès",
      href: "/insight",
    },
  ];

  if (!isMounted) return null;

  if (loading || isLoading || isAverage || isClassing)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        {/* navigation tabs */}
        <div className="grid overflow-x-auto">
          <div className="mb-5 ml-4 mt-10 flex flex-wrap gap-5 overflow-x-auto whitespace-nowrap text-[20px] font-semibold">
            <Link href="/insight" className="text-blue-500 underline">
              {currentLanguage === "ar"
                ? "تقدم الطلاب"
                : currentLanguage === "fr"
                  ? "Progression des étudiants"
                  : "Student Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/school">
              {currentLanguage === "ar"
                ? "تقدم المدرسة"
                : currentLanguage === "fr"
                  ? "Progression de l'école"
                  : "School Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/class">
              {currentLanguage === "ar"
                ? "تقدم الفصل"
                : currentLanguage === "fr"
                  ? "Progression de la classe"
                  : "Class Performance"}
            </Link>
            <Link className="hover:text-blue-500 hover:underline" href="/insight/ml-exam">
              {currentLanguage === "ar"
                ? "ML التقدم في امتحان تعلم الالة"
                : currentLanguage === "fr"
                  ? "Progression à l'examen de ML"
                  : "ML Exam Performance"}
            </Link>
          </div>
        </div>

        {/* charts */}
        <div className="mt-5 flex flex-col xl:flex-row justify-evenly gap-4">
          {/* Average grade/attendance */}
          <Card className="w-full h-fit overflow-x-auto bg-bgPrimary xl:w-3/5">
            <CardHeader>
              <CardTitle>
                {currentLanguage === "ar"
                  ? "تقدم الطلاب"
                  : currentLanguage === "fr"
                    ? "Progression des étudiants"
                    : "Student Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" aspect={2}>
                  <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="stage"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value: string) => {
                        if (currentLanguage === "ar") {
                          return value === "KINDERGARTEN"
                            ? "رياض الأطفال"
                            : value === "PRIMARY"
                              ? "الابتدائي"
                              : value === "PREPARATORY"
                                ? "الإعدادي"
                                : value === "SECONDARY"
                                  ? "الثانوي"
                                  : value;
                        }
                        if (currentLanguage === "fr") {
                          return value === "KINDERGARTEN"
                            ? "Jardin"
                            : value === "PRIMARY"
                              ? "Primaire"
                              : value === "PREPARATORY"
                                ? "Collège"
                                : value === "SECONDARY"
                                  ? "Lycée"
                                  : value;
                        }
                        return value;
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      domain={[0, "dataMax + 1"]}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="AVGGrade"
                      fill="var(--color-desktop)"
                      name={
                        currentLanguage === "ar"
                          ? "متوسط النقاط"
                          : currentLanguage === "fr"
                            ? "Note moyenne"
                            : "Average Grade"
                      }
                      radius={[5, 5, 0, 0]}
                      barSize={30}
                    />
                    <Bar
                      dataKey="AVGAttendance"
                      fill="var(--color-mobile)"
                      name={
                        currentLanguage === "ar"
                          ? "متوسط الحضور"
                          : currentLanguage === "fr"
                            ? "Présence moyenne"
                            : "Average Attendance"
                      }
                      radius={[5, 5, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2 w-full xl:w-2/5">
            {/* Attendance trend */}
            <Card className="w-full bg-bgPrimary">
              <CardHeader>
                <CardTitle>
                  {currentLanguage === "ar"
                    ? "مواظبة التلاميذ"
                    : currentLanguage === "fr"
                      ? "Assiduité des élèves"
                      : "Improving Student Attendance"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig2}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={transformedAttendanceData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={value => value.slice(0, 3)}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        dataKey="KINDERGARTEN"
                        type="monotone"
                        stroke="#8884d8"
                        strokeWidth={4}
                        dot={false}
                      />
                      <Line
                        dataKey="PRIMARY"
                        type="monotone"
                        stroke="#82ca9d"
                        strokeWidth={4}
                        dot={false}
                      />
                      <Line
                        dataKey="PREPARATORY"
                        type="monotone"
                        stroke="#ffc658"
                        strokeWidth={4}
                        dot={false}
                      />
                      <Line
                        dataKey="SECONDARY"
                        type="monotone"
                        stroke="#ff7300"
                        strokeWidth={4}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Struggling students */}
            <Card className="w-full overflow-x-auto whitespace-nowrap bg-bgPrimary">
              <CardHeader>
                <CardTitle>
                  {currentLanguage === "ar"
                    ? "الطلاب المتعثرون"
                    : currentLanguage === "fr"
                      ? "Élèves en difficulté"
                      : "Struggling Students"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label className="mr-2">
                    {currentLanguage === "ar"
                      ? "اختر الفصل:"
                      : currentLanguage === "fr"
                        ? "Sélectionner une classe:"
                        : "Select Class:"}
                  </label>
                  <select
                    className="mx-3 rounded-lg border border-borderPrimary bg-bgPrimary px-4 py-2 shadow-sm outline-none"
                    value={classroomId || ""}
                    onChange={e => setClassroomId(e.target.value || null)}
                  >
                    <option value="">Select Class</option>
                    {classes?.data?.content?.map(
                      (classroom: { roomId: string; classroomName: string }) => (
                        <option key={classroom.roomId} value={classroom.roomId}>
                          {classroom.classroomName}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {classroomId ? (
                  isStudentsLoading ? (
                    <div className="flex h-[300px] items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={chartData3}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="attendance"
                          fill="#e23670"
                          name={
                            currentLanguage === "ar"
                              ? "الحضور (متوسط)"
                              : currentLanguage === "fr"
                                ? "(AVG) Présences"
                                : "(AVG) Attendances"
                          }
                          barSize={17}
                          radius={10}
                        />
                        <Bar
                          dataKey="grade"
                          fill="#2560d4"
                          name={
                            currentLanguage === "ar"
                              ? "النقاط (متوسط)"
                              : currentLanguage === "fr"
                                ? "(AVG) Note"
                                : "(AVG) Grade"
                          }
                          barSize={17}
                          radius={10}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  )
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-center text-gray-500">
                    {currentLanguage === "ar"
                      ? "الرجاء اختيار فصل لعرض بيانات الطلاب"
                      : currentLanguage === "fr"
                        ? "Veuillez sélectionner une classe pour afficher les données des élèves"
                        : "Please select a class to view student data"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </>
  );
}

export default InsightPage;
