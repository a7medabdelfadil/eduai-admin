// 📁 components/BudgetChart.tsx
"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useGetBudgetChartQuery } from "@/features/Financial/feesApi";
import Spinner from "@/components/spinner";
import type { ApexOptions } from "apexcharts";    // ✅ NEW
import { useTheme } from "next-themes";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface BudgetChartProps {
    year?: number;
}

const BudgetChart: React.FC<BudgetChartProps> = ({ year = new Date().getFullYear() }) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { language: currentLanguage } = useSelector((state: RootState) => state.language);
    const { data, isLoading, isError } = useGetBudgetChartQuery(year);

    if (isLoading) return <div className="h-96 flex justify-center items-center bg-bgPrimary">
        <Spinner />
    </div>;
    if (isError || !data?.data?.MonthsResponse) return null;

    const order = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
    ];
    const monthValues = order.map(m => data.data.MonthsResponse[m] ?? 0);
    const categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chartOptions: ApexOptions = {
        chart: {
            height: 350,
            type: "line" as const,
            zoom: { enabled: false },
            background: "transparent",
            foreColor: isDark ? "#f3f4f6" : "#1f2937",
        },
        dataLabels: { enabled: false },
        stroke: { curve: "straight" },
        title: {
            text:
                currentLanguage === "ar"
                    ? "المالية المدرسية"
                    : currentLanguage === "fr"
                        ? "Finance scolaire"
                        : "School Finance",
            align: "left",
            style: {
                color: isDark ? "#f3f4f6" : "#1f2937",
                fontSize: "16px",
            },
        },
        grid: {
            row: {
                colors: isDark ? ["#2a2a2a", "transparent"] : ["#f3f3f3", "transparent"],
                opacity: 0.5,
            },
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    colors: isDark ? "#e5e7eb" : "#374151",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: isDark ? "#e5e7eb" : "#374151",
                },
            },
        },
    };


    const series = [{ name: "Revenue", data: monthValues }];

    return (
        <ReactApexChart
            options={chartOptions}
            series={series}
            type="line"
            height={350}
        />
    );
};

export default BudgetChart;
