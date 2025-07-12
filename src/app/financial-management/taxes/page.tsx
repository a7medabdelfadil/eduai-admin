/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useDeleteTaxesMutation,
  useGetAllTaxesQuery,
} from "@/features/Financial/taxesApi";
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { RiEdit2Fill } from "react-icons/ri";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import { Skeleton } from "@/components/Skeleton";
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
      nameEn: "Taxes",
      nameAr: "الضرائب",
      nameFr: "Impôts",
      href: "/financial-management/taxes",
    },
  ];

  const { data, error, isLoading, refetch } = useGetAllTaxesQuery(null);
  type Invoice = Record<string, any>;
  const [search, setSearch] = useState("");
  const [deleteInvoice] = useDeleteTaxesMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id).unwrap();

      toast.success(`Bus with ID ${id} Deleted successfully`);
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
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
    { key: "Tax Type", en: "Tax Type", ar: "نوع الضريبة", fr: "Type d'impôt" },
    {
      key: "Start Date",
      en: "Start Date",
      ar: "تاريخ البدء",
      fr: "Date de début",
    },
    {
      key: "End Date",
      en: "End Date",
      ar: "تاريخ الانتهاء",
      fr: "Date de fin",
    },
    { key: "About", en: "About", ar: "حول", fr: "À propos" },
    {
      key: "Amount Paid",
      en: "Amount Paid",
      ar: "المبلغ المدفوع",
      fr: "Montant payé",
    },
    {
      key: "Payment Date",
      en: "Payment Date",
      ar: "تاريخ الدفع",
      fr: "Date de paiement",
    },
    {
      key: "Payment Method",
      en: "Payment Method",
      ar: "طريقة الدفع",
      fr: "Méthode de paiement",
    },
    { key: "Receipt", en: "Receipt", ar: "رقم الإيصال", fr: "Reçu" },
    { key: "Action", en: "Action", ar: "الإجراء", fr: "Action" },
    {
      key: "Receipt Image",
      en: "Receipt Image",
      ar: "صورة الإيصال",
      fr: "Image du reçu",
    },
    { key: "View", en: "View", ar: "عرض", fr: "Voir" },
    { key: "No image", en: "No image", ar: "لا توجد صورة", fr: "Pas d'image" },
    { key: "Result(s)", en: "Result(s)", ar: "نتيجة", fr: "résultat(s)" },
    {
      key: "No data available",
      en: "No data available",
      ar: "لا توجد بيانات",
      fr: "Aucune donnée disponible",
    },
  ];

  const translate = (key: string, lang: string) => {
    const item = translations.find(t => t.key === key);
    if (!item) return key;
    return lang === "ar" ? item.ar : lang === "fr" ? item.fr : item.en;
  };

  const filteredData = data?.data.content?.filter((invoice: Invoice) =>
    search.trim() === ""
      ? true
      : invoice.receiptNumber?.toLowerCase().includes(search.toLowerCase()),
  );

  const [visibleCount, setVisibleCount] = useState(10);
  const handleShowMore = () => setVisibleCount(prev => prev + 10);

  const displayedData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="justify-left mb-5 ml-4 flex gap-5 text-[23px] font-semibold">
          <Link
            href="/financial-management/taxes"
            className="text-blue-500 underline"
          >
            {currentLanguage === "en"
              ? "Paid Taxes"
              : currentLanguage === "ar"
                ? "الضرائب المدفوعة"
                : currentLanguage === "fr"
                  ? "Taxes payées"
                  : "Invoices"}{" "}
            {/* Default to English */}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/financial-management/taxes/invoices"
          >
            {currentLanguage === "en"
              ? "Invoices Taxes"
              : currentLanguage === "ar"
                ? "ضرائب الفواتير "
                : currentLanguage === "fr"
                  ? "Factures Taxes"
                  : "Scholarship"}{" "}
            {/* Default to English */}
          </Link>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col md:items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
            {/* Search Input */}
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
                  placeholder={
                    currentLanguage === "en"
                      ? "Search"
                      : currentLanguage === "ar"
                        ? "بحث"
                        : "Recherche"
                  }
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0}{" "}
                  {translate("Result(s)", currentLanguage)}
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <Link
                href="/financial-management/taxes/add-taxes"
                className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
              >
                {currentLanguage === "en"
                  ? "+ Add Taxes"
                  : currentLanguage === "ar"
                    ? "+ إضافة الفواتير"
                    : currentLanguage === "fr"
                      ? "+ Ajouter des factures"
                      : "+ Add Invoices"}{" "}
                {/* Default to English */}
              </Link>
            </div>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {translate("Tax Type", currentLanguage)}
                  </TableHead>
                  <TableHead>
                    {translate("Start Date", currentLanguage)}
                  </TableHead>
                  <TableHead>
                    {translate("End Date", currentLanguage)}
                  </TableHead>
                  <TableHead>{translate("About", currentLanguage)}</TableHead>
                  <TableHead>
                    {translate("Amount Paid", currentLanguage)}
                  </TableHead>
                  <TableHead>
                    {translate("Payment Date", currentLanguage)}
                  </TableHead>
                  <TableHead>
                    {translate("Payment Method", currentLanguage)}
                  </TableHead>
                  <TableHead>{translate("Receipt", currentLanguage)}</TableHead>
                  <TableHead>{translate("Action", currentLanguage)}</TableHead>
                  <TableHead>
                    {translate("Receipt Image", currentLanguage)}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(10)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full max-w-[100px]" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filteredData?.length ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="py-4 text-center text-gray-500"
                    >
                      {translate("No data available", currentLanguage)}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedData.map((invoice: Invoice, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{invoice.taxType}</TableCell>
                      <TableCell>
                        {formatTransactionDate(invoice.startDate)}
                      </TableCell>
                      <TableCell>
                        {formatTransactionDate(invoice.endDate)}
                      </TableCell>
                      <TableCell>{invoice.about}</TableCell>
                      <TableCell>{invoice.paidAmount}</TableCell>
                      <TableCell>
                        {formatTransactionDate(invoice.paymentDate)}
                      </TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell>{invoice.receiptNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleDelete(invoice.id)}>
                            <BiTrash className="h-4 w-4 text-red-500" />
                          </button>
                          <Link
                            href={`/financial-management/taxes/${invoice.id}`}
                          >
                            <RiEdit2Fill className="h-4 w-4 text-blue-600" />
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>
                        {invoice.hasPhoto ? (
                          <a
                            href={invoice.photoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {translate("View", currentLanguage)}
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            {translate("No image", currentLanguage)}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {filteredData?.length > visibleCount && (
              <SeeMoreButton onClick={handleShowMore} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default FeesManagement;
