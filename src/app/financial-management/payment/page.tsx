/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useDeleteInvoicesMutation,
  useGetAllInvoicesQuery,
} from "@/features/Financial/feesApi";
import Spinner from "@/components/spinner";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";

const Payment = () => {
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
      nameEn: "Payment",
      nameAr: "الدفع",
      nameFr: "Paiement",
      href: "/financial-management/payment",
    },
  ];

  const { data, error, isLoading, refetch } = useGetAllInvoicesQuery(null);
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  type Invoice = Record<string, any>;
  const [search, setSearch] = useState("");

  const [deleteInvoice] = useDeleteInvoicesMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id).unwrap();

      toast.success(`Bus with ID ${id} Deleted successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to Delete the Bus");
    }
  };
  const formatTransactionDate = (dateString: string | number | Date) => {
    if (!dateString) return "No transaction date";
    const formatter = new Intl.DateTimeFormat("en-EG", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    });
    return formatter.format(new Date(dateString));
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const translations = [
    { key: "Name", en: "Name", ar: "الاسم", fr: "Nom" },
    { key: "Paid Amount", en: "Paid Amount", ar: "المبلغ المدفوع", fr: "Montant Payé" },
    { key: "Total Fees Amount", en: "Total Fees Amount", ar: "إجمالي مبلغ الرسوم", fr: "Montant Total des Frais" },
    { key: "Invoice Date", en: "Invoice Date", ar: "تاريخ الفاتورة", fr: "Date de la Facture" },
    { key: "Status", en: "Status", ar: "الحالة", fr: "Statut" },
    { key: "Discount", en: "Discount", ar: "الخصم", fr: "Réduction" },
    { key: "Action", en: "Action", ar: "الإجراء", fr: "Action" },
    { key: "Search anything", en: "Search anything", ar: "ابحث عن أي شيء", fr: "Rechercher n'importe quoi" },
    { key: "Result(s)", en: "Result(s)", ar: "نتيجة", fr: "résultat(s)" },
    { key: "No data available", en: "No data available", ar: "لا توجد بيانات", fr: "Aucune donnée disponible" },
  ];

  const translate = (key: string, language: string) => {
    const entry = translations.find(item => item.key === key);
    if (!entry) return key;

    return language === "ar"
      ? entry.ar
      : language === "fr"
        ? entry.fr
        : entry.en;
  };

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
                  className="size-4 flex-shrink-0 text-gray-400"
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
                onChange={e => setSearch(e.target.value)}
                type="text"
                id="icon"
                name="icon"
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                placeholder="Search"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/fees-management/new-invoice"
              className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ Add Invoices"
                : currentLanguage === "ar"
                  ? "+ إضافة الفواتير"
                  : currentLanguage === "fr"
                    ? "+ Ajouter des factures"
                    : "+ Add Invoices"}{" "}
              {/* Default to English */}
            </Link>
          </div>
        </div>
        <div className="justify-left mb-5 ml-4 flex gap-5 text-[20px] font-semibold">
          <Link
            href="/financial-management"
            className="text-blue-500 underline"
          >
            {currentLanguage === "en"
              ? "Tuition"
              : currentLanguage === "ar"
                ? "الرسوم الدراسية"
                : currentLanguage === "fr"
                  ? "Frais de scolarité"
                  : "Tuition"}{" "}
            {/* Default to English */}
          </Link>
          <Link
            className="text-secondary hover:text-blue-500 hover:underline"
            href="/financial-management/activity">
            {currentLanguage === "en"
              ? "Activity"
              : currentLanguage === "ar"
                ? "النشاط"
                : currentLanguage === "fr"
                  ? "Activité"
                  : "Activity"}{" "}
            {/* Default to English */}
          </Link>
          <Link
            className="text-secondary hover:text-blue-500 hover:underline"
            href="/financial-management/transport">
            {currentLanguage === "en"
              ? "Transport"
              : currentLanguage === "ar"
                ? "النقل"
                : currentLanguage === "fr"
                  ? "Transport"
                  : "Transport"}{" "}
            {/* Default to English */}
          </Link>
          <Link
            className="text-secondary hover:text-blue-500 hover:underline"
            href="/financial-management/uniform">
            {currentLanguage === "en"
              ? "Uniform"
              : currentLanguage === "ar"
                ? "الزي الرسمي"
                : currentLanguage === "fr"
                  ? "Uniforme"
                  : "Uniform"}{" "}
            {/* Default to English */}
          </Link>
          <Link
            className="text-secondary hover:text-blue-500 hover:underline"
            href="/financial-management/material">
            {currentLanguage === "en"
              ? "Material"
              : currentLanguage === "ar"
                ? "المواد"
                : currentLanguage === "fr"
                  ? "Matériel"
                  : "Material"}{" "}
            {/* Default to English */}
          </Link>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg bg-bgPrimary">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translate("Name", currentLanguage)}</TableHead>
                <TableHead>{translate("Paid Amount", currentLanguage)}</TableHead>
                <TableHead>{translate("Total Fees Amount", currentLanguage)}</TableHead>
                <TableHead>{translate("Invoice Date", currentLanguage)}</TableHead>
                <TableHead>{translate("Status", currentLanguage)}</TableHead>
                <TableHead>{translate("Discount", currentLanguage)}</TableHead>
                <TableHead>{translate("Action", currentLanguage)}</TableHead>
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
                    {translate("No data available", currentLanguage)}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.content
                  .filter((invoice: Invoice) =>
                    search.trim() === ""
                      ? true
                      : invoice.billedToName.toLowerCase().includes(search)
                  )
                  .map((invoice: Invoice, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{invoice.billedToName}</TableCell>
                      <TableCell>{invoice.paidAmount}</TableCell>
                      <TableCell>{invoice.totalFeesAmount}</TableCell>
                      <TableCell>{formatTransactionDate(invoice.creationDate)}</TableCell>
                      <TableCell>
                        {invoice.paymentStatus === "NOT_FULLY_PAID" ? (
                          <div className="flex items-center gap-2 font-semibold text-error">
                            <div className="h-2.5 w-2.5 rounded-full bg-error" />
                            Unpaid
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 font-semibold text-primary">
                            <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                            Paid
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{invoice.discountAmount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleDelete(invoice.billedToId)}>
                            <svg className="h-6 w-6 text-red-500" /* ... */ />
                          </button>
                          <Link
                            href={`/fees-management/${invoice.billedToId}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            <svg className="h-6 w-6 text-blue-500" /* ... */ />
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      </Container>
    </>
  );
};

export default Payment;
