/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import Spinner from "@/components/spinner";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useDeleteTaxesMutation,
  useGetAllTaxesQuery,
} from "@/features/Financial/taxesApi";

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

  const [selectAll, setSelectAll] = useState(false);
  const { data, error, isLoading, refetch } = useGetAllTaxesQuery(null);
  console.log("👾 ~ FeesManagement ~ data:", data)
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  type Invoice = Record<string, any>;
  const [search, setSearch] = useState("");
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    checkboxes.forEach(checkbox => {
      checkbox.checked = !selectAll;
    });
  };

  useEffect(() => {
    const handleOtherCheckboxes = () => {
      const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not(#checkbox-all-search)',
      );
      const allChecked = Array.from(allCheckboxes).every(
        checkbox => checkbox.checked,
      );
      const selectAllCheckbox = document.getElementById(
        "checkbox-all-search",
      ) as HTMLInputElement | null;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
        setSelectAll(allChecked);
      }
    };

    const otherCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    otherCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", handleOtherCheckboxes);
    });

    return () => {
      otherCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener("change", handleOtherCheckboxes);
      });
    };
  }, []);

  const [deleteInvoice] = useDeleteTaxesMutation();

  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id).unwrap();

      toast.success(`Bus with ID ${id} Deleted successfully`);
      void refetch();
    } catch {
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

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
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
          } relative mx-3 mt-10 h-screen overflow-x-auto bg-transparent sm:rounded-lg`}
      >
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
          <div className="flex justify-center">
            <Link
              href="/financial-management/taxes/add-taxes"
              className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
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
          <Link href="/financial-management/taxes/invoices">
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
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="-gray-800 h-4 w-4 rounded border-borderPrimary bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Tax Type"
                    : currentLanguage === "ar"
                      ? "الاسم"
                      : currentLanguage === "fr"
                        ? "Nom"
                        : "Name"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Start Date"
                    : currentLanguage === "ar"
                      ? "المبلغ المدفوع"
                      : currentLanguage === "fr"
                        ? "Montant Payé"
                        : "Start Date"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "End Date"
                    : currentLanguage === "ar"
                      ? "إجمالي مبلغ الرسوم"
                      : currentLanguage === "fr"
                        ? "Montant Total des Frais"
                        : "End Date"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "about"
                    : currentLanguage === "ar"
                      ? "تاريخ الفاتورة"
                      : currentLanguage === "fr"
                        ? "about"
                        : "about"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Amount Paid"
                    : currentLanguage === "ar"
                      ? "الحالة"
                      : currentLanguage === "fr"
                        ? "Amount Paid"
                        : "Amount Paid "}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Payment Date"
                    : currentLanguage === "ar"
                      ? "الحالة"
                      : currentLanguage === "fr"
                        ? "Amount Paid"
                        : "Amount Paid "}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Payment Method"
                    : currentLanguage === "ar"
                      ? "الخصم"
                      : currentLanguage === "fr"
                        ? "Payment Date"
                        : "Discount"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Receipt"
                    : currentLanguage === "ar"
                      ? "الخصم"
                      : currentLanguage === "fr"
                        ? "Payment Date"
                        : "Discount"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Action"
                    : currentLanguage === "ar"
                      ? "الإجراء"
                      : currentLanguage === "fr"
                        ? "Action"
                        : "Action"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Receipt Image"
                    : currentLanguage === "ar"
                      ? "صورة الإيصال"
                      : currentLanguage === "fr"
                        ? "Image du reçu"
                        : "Receipt Image"}
                </th>

              </tr>
            </thead>
            <tbody>
              {data?.data.content
                .filter((invoice: Invoice) => {
                  return search.toLocaleLowerCase() === ""
                    ? invoice
                    : invoice.billedToName.toLocaleLowerCase().includes(search);
                })
                .map((invoice: Invoice, index: number) => (
                  <tr
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                    key={index}
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="h-4 w-4 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-hover"
                        />
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="text-text-textSeceondary flex items-center whitespace-nowrap px-6 py-4 font-medium"
                    >
                      {invoice.taxType}
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">
                      {formatTransactionDate(invoice.startDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {formatTransactionDate(invoice.endDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.about}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.paidAmount}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {formatTransactionDate(invoice.paymentDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.paymentMethod}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.receiptNumber}
                    </td>


                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
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
                          href={`/financial-management/taxes/${invoice.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          edit
                        </Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.hasPhoto ? (
                        <a
                          href={invoice.photoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {currentLanguage === "en"
                            ? "View"
                            : currentLanguage === "ar"
                              ? "عرض"
                              : currentLanguage === "fr"
                                ? "Voir"
                                : "View"}
                        </a>
                      ) : (
                        <span className="text-gray-400">
                          {currentLanguage === "en"
                            ? "No image"
                            : currentLanguage === "ar"
                              ? "لا توجد صورة"
                              : currentLanguage === "fr"
                                ? "Pas d'image"
                                : "No image"}
                        </span>
                      )}
                    </td>


                  </tr>
                ))}
            </tbody>
          </table>
          {(data?.data.content.length == 0 || data == null) && (
            <div className="flex w-full justify-center py-3 text-center text-[18px] font-semibold">
              {currentLanguage === "en"
                ? "There is No Data"
                : currentLanguage === "ar"
                  ? "لا توجد بيانات"
                  : currentLanguage === "fr"
                    ? "Il n'y a pas de données"
                    : "There is No Data"}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeesManagement;
