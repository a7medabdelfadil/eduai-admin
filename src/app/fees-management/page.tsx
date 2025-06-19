/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import {
  useDeleteInvoicesMutation,
  useGetAllInvoicesQuery,
} from "@/features/Financial/feesApi";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
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
import { BiSearchAlt } from "react-icons/bi";
import path from "path";
import SeeMoreButton from "@/components/SeeMoreButton";

const FeesManagement = () => {
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
      nameEn: "Fees Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/fees-management",
    },
  ];

  const { data, isLoading, refetch } = useGetAllInvoicesQuery(null);
  const [deleteInvoice] = useDeleteInvoicesMutation();
  const [search, setSearch] = useState("");

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

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id).unwrap();
      toast.success(`Invoice with ID ${id} deleted successfully`);
      void refetch();
    } catch {
      toast.error("Failed to delete the invoice");
    }
  };

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

  const filteredData = data?.data?.content?.filter((invoice: any) =>
    invoice.billedToName.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Fees Management"
              : currentLanguage === "ar"
                ? "إدارة المستندات"
                : "Gestion des documents"}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="relative w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate.searchPlaceholder}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/fees-management/new-invoice"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ Add Invoices"
                : currentLanguage === "ar"
                  ? "+ إضافة الفواتير"
                  : "+ Ajouter des factures"}
            </Link>
          </div>
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
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Action"
                      : currentLanguage === "ar"
                        ? "الإجراء"
                        : "Action"}
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
                ) : !filteredData?.length ? (
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
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleDelete(invoice.id)}>
                            <svg
                              className="h-6 w-6 text-red-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <Link
                            href={`/fees-management/${invoice.id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            <svg
                              className="h-6 w-6 text-blue-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {visibleCount < (filteredData?.length || 0) && (
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

export default FeesManagement;
