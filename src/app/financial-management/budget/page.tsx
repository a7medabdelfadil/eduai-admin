/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Spinner from "@/components/spinner";
import Container from "@/components/Container";
import { useGetAllInvoicesQuery } from "@/features/Financial/feesApi";
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
import { useGetBudgetSummaryQuery } from "@/features/Financial/budgetApi";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ApexChart = () => {
  const [series, setSeries] = useState([
    {
      name: "Expense",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ]);

  const [options, setOptions] = useState({
    series: [
      {
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        tooltip: {
          theme: "dark",
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  });

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
          width={800}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

const Budget = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
    {
      nameEn: "Budget",
      nameAr: "الميزانية",
      nameFr: "Budget",
      href: "/financial-management/budget",
    },
  ];
  const { data: budgetData, isLoading: isData, isError } = useGetBudgetSummaryQuery(null);

  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );
  const translate = {
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن الفاتورة"
        : currentLanguage === "fr"
          ? "Rechercher une facture"
          : "Search invoice",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
  };
  const { data, isLoading, refetch } = useGetAllInvoicesQuery(null);
  const formatTransactionDate = (dateString: string | number | Date) => {
    if (!dateString) return "No transaction date";
    const formatter = new Intl.DateTimeFormat("en-EG", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formatter.format(new Date(dateString));
  };

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = data?.data?.content?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Budget"
              : currentLanguage === "ar"
                ? "الميزانية"
                : currentLanguage === "fr"
                  ? "Budget"
                  : "Budget"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="mb-5 flex justify-center gap-4 max-[840px]:grid">
          {/* Total Earning */}
          <div className="grid gap-4 max-[840px]:flex max-[840px]:gap-2">
            <div className="flex h-[120px] w-[240px] items-center justify-between gap-3 rounded-xl bg-bgPrimary p-4 shadow-xl max-[840px]:w-[200px] max-[576px]:h-[110px]">
              <div>
                <img src="/images/earnning.png" alt="#" className="h-14 w-14" />
              </div>
              <div>
                <p className="text-[15px] text-gray-400">
                  {currentLanguage === "en"
                    ? "Total Earning"
                    : currentLanguage === "ar"
                      ? "إجمالي الأرباح"
                      : "Gains totaux"}
                </p>
                <h1 className="text-[22px] font-semibold">
                  {budgetData?.data?.totalEarning}
                </h1>
              </div>
            </div>
          </div>

          {/* MasterCard Card */}
          <div className="grid gap-2">
            <div className="relative m-auto h-56 w-96 transform rounded-xl bg-red-100 text-white shadow-2xl transition-transform max-[840px]:w-[340px]">
              <img
                className="relative h-full w-full rounded-xl object-cover"
                src="https://i.imgur.com/kGkSg1v.png"
                alt="#"
              />
              <div className="absolute top-8 w-full px-8">
                <div className="flex justify-between">
                  <div>
                    <h1 className="font-light">
                      {currentLanguage === "en"
                        ? "Current Balance"
                        : currentLanguage === "ar"
                          ? "الرصيد الحالي"
                          : currentLanguage === "fr"
                            ? "Solde actuel"
                            : "Current Balance"}

                    </h1>
                    <p className="font-medium tracking-wider">{budgetData?.data?.balance}
                    </p>
                  </div>
                  <img
                    className="h-14 w-14"
                    src="https://i.imgur.com/bbPHJVe.png"
                    alt="#"
                  />
                </div>
                <div className="pt-1">
                  <h1 className="font-light">
                    {currentLanguage === "en"
                      ? "Card Number"
                      : currentLanguage === "ar"
                        ? "رقم البطاقة"
                        : "Numéro de carte"}
                  </h1>
                  <p className="tracking-more-wider font-medium">
                    4642 3489 9867 7632
                  </p>
                </div>
                <div className="pr-6 pt-6">
                  <div className="flex justify-between">
                    <div>
                      <h1 className="text-xs font-light">
                        {currentLanguage === "en"
                          ? "Valid"
                          : currentLanguage === "ar"
                            ? "صالح"
                            : "Valide"}
                      </h1>
                      <p className="text-sm font-medium tracking-wider">11/15</p>
                    </div>
                    <div>
                      <h1 className="text-xs font-light">
                        {currentLanguage === "en"
                          ? "Expiry"
                          : currentLanguage === "ar"
                            ? "انتهاء"
                            : "Expiration"}
                      </h1>
                      <p className="text-sm font-medium tracking-wider">03/25</p>
                    </div>
                    <div>
                      <h1 className="text-xs font-light">
                        {currentLanguage === "en"
                          ? "CVV"
                          : currentLanguage === "ar"
                            ? "رمز الأمان"
                            : "CVV"}
                      </h1>
                      <p className="tracking-more-wider text-sm font-bold">···</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Spending */}
          <div className="grid gap-4 max-[840px]:flex max-[840px]:gap-2">
            <div className="flex h-[120px] w-[240px] items-center justify-between gap-3 rounded-xl bg-bgPrimary p-4 shadow-xl max-[840px]:w-[200px] max-[576px]:h-[110px]">
              <div>
                <img src="/images/spending.png" alt="#" className="h-14 w-14" />
              </div>
              <div>
                <p className="text-[15px] text-gray-400">
                  {currentLanguage === "en"
                    ? "Total Spending"
                    : currentLanguage === "ar"
                      ? "إجمالي الإنفاق"
                      : "Dépenses totales"}
                </p>
                <h1 className="text-[22px] font-semibold">
                  {budgetData?.data?.totalSpending}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid w-full grid-cols-1 justify-center gap-10 overflow-x-auto 2xl:flex">
          <div className="flex overflow-x-auto">
            <div
              id="chart"
              className="w-[850px] overflow-x-auto rounded-xl bg-bgPrimary p-2 shadow-xl"
            >
              <p className="text-[18px] font-semibold">
                {currentLanguage === "en"
                  ? "School Finance"
                  : currentLanguage === "ar"
                    ? "المالية المدرسية"
                    : "Finance scolaire"}
              </p>

              <ApexChart />
            </div>
          </div>
        </div>
        <div className="grid w-full rounded-xl bg-bgPrimary p-5">
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Name"
                      : currentLanguage === "ar"
                        ? "الاسم"
                        : "Nom"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Paid Amount"
                      : currentLanguage === "ar"
                        ? "المبلغ المدفوع"
                        : "Montant Payé"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Total Fees Amount"
                      : currentLanguage === "ar"
                        ? "إجمالي مبلغ الرسوم"
                        : "Montant Total des Frais"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Invoice Date"
                      : currentLanguage === "ar"
                        ? "تاريخ الفاتورة"
                        : "Date de la Facture"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Status"
                      : currentLanguage === "ar"
                        ? "الحالة"
                        : "Statut"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Discount"
                      : currentLanguage === "ar"
                        ? "الخصم"
                        : "Réduction"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !data?.data?.content?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((invoice: any, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{invoice.billedToName}</TableCell>
                      <TableCell>{invoice.paidAmount}</TableCell>
                      <TableCell>{invoice.totalFeesAmount}</TableCell>
                      <TableCell>
                        {formatTransactionDate(invoice.creationDate)}
                      </TableCell>
                      <TableCell>
                        {invoice.paymentStatus === "NOT_FULLY_PAID" ? (
                          <div className="flex items-center gap-2 font-semibold text-error">
                            <div className="h-2.5 w-2.5 rounded-full bg-error"></div>{" "}
                            Unpaid
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-semibold text-primary">
                            <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>{" "}
                            Paid
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{invoice.discountAmount}</TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {visibleCount < (data?.length || 0) && (
              <SeeMoreButton
                onClick={() => setVisibleCount(prev => prev + 20)}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Budget;
