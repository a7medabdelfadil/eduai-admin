"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Pie,
  PieChart,
  Tooltip,
  LabelList,
  CartesianGrid,
  XAxis,
  Line,
  LineChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";

const School = () => {
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "#34B3F15E",
    },
    safari: {
      label: "Safari",
      color: "#2662d9",
    },
    firefox: {
      label: "Firefox",
      color: "#e88c30",
    },
    edge: {
      label: "Edge",
      color: "#af57db",
    },
    other: {
      label: "Other",
      color: "#2eb88a",
    },
  };

  const booleanValue = useSelector((state: RootState) => state.boolean.value); // sidebar

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
      href: "/insight/school",
    },
  ];
  const chartData2 = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];
  const chartConfig2 = {
    desktop: {
      label: "Desktop",
      color: "#af57db",
    },
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
       {/* navigation tabs */}
        <div className="grid overflow-x-auto">
          <div className="mb-5 ml-4 mt-10 flex flex-wrap gap-5 overflow-x-auto whitespace-nowrap text-[20px] font-semibold">
            <Link className="hover:text-blue-500 hover:underline" href="/insight" >
              {currentLanguage === "ar"
                ? "تقدم الطلاب"
                : currentLanguage === "fr"
                  ? "Progression des étudiants"
                  : "Student Performance"}
            </Link>
            <Link className="text-blue-500 underline" href="/insight/school">
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

        <div className="flex flex-col gap-6 py-6 max-md:px-6 md:flex-row">
          <Card className="flex flex-1 flex-col bg-bgPrimary">
            <CardHeader>
              <CardTitle>School Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig2}>
                <LineChart
                  accessibilityLayer
                  data={chartData2}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={value => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="flex flex-1 flex-col bg-bgPrimary">
            <CardHeader className="items-center pb-0">
              <CardTitle>Subject Performance</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square max-h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="visitors"
                    nameKey="browser"
                    outerRadius={100}
                  >
                    <LabelList dataKey="visitors" position="inside" />
                  </Pie>
                  <Tooltip
                    content={<ChartTooltipContent nameKey="browser" />}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="browser" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </Container>
    </>
  );
};

export default School;
