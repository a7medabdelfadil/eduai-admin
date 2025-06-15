/* eslint-disable @next/next/no-img-element */
"use client";
import Soon from "@/components/soon";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner";
import {
  useDeleteScholarshipMutation,
  useGetAllScholarshipQuery,
} from "@/features/Financial/feesApi";

const Scholarship = () => {
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
      nameEn: "Scholarship",
      nameAr: "منحة دراسية",
      nameFr: "Bourse d'étude",
      href: "/fees-management/scholarship",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { data, error, isLoading, refetch } = useGetAllScholarshipQuery(null);
  const [selectAll, setSelectAll] = useState(false);
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
  const [deleteInvoice] = useDeleteScholarshipMutation();
  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id).unwrap();

      toast.success(`Scholarship with ID ${id} Deleted successfully`);
      void refetch();
    } catch {
      toast.error("Failed to Delete the Scholarship");
    }
  };
  type Invoice = Record<string, any>;
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
      {/* <Soon /> */}

      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${
          currentLanguage === "ar"
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
              href="/fees-management/new-scholarship"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ Add Scholarship"
                : currentLanguage === "ar"
                  ? "+ إضافة منحة"
                  : "+ Ajouter une bourse"}
            </Link>
          </div>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="text-bgSecondary0 w-full overflow-x-auto text-left text-sm rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    {/* Add event listener for select all checkbox */}
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      className="-gray-800 h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "student Name"
                    : currentLanguage === "ar"
                      ? "اسم الطالب"
                      : "Nom de l'étudiant"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "ID"
                    : currentLanguage === "ar"
                      ? "الرقم"
                      : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "scholarship Name"
                    : currentLanguage === "ar"
                      ? "اسم المنحة الدراسية"
                      : "Nom de la bourse"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "scholarship Type"
                    : currentLanguage === "ar"
                      ? "نوع المنحة الدراسة"
                      : "Type de bourse"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "start Date"
                    : currentLanguage === "ar"
                      ? "تاريخ البدء"
                      : "date de début"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "expiration Date"
                    : currentLanguage === "ar"
                      ? "تاريخ الانتهاء"
                      : "Date d'expiration"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Action"
                    : currentLanguage === "ar"
                      ? "الإجراء"
                      : currentLanguage === "fr"
                        ? "Action"
                        : "Action"}{" "}
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.data.content
                .filter((invoice: Invoice) => {
                  return search.toLocaleLowerCase() === ""
                    ? invoice
                    : invoice.studentName.toLocaleLowerCase().includes(search);
                })
                .map((invoice: Invoice, index: number) => (
                  <tr
                    key={index}
                    className="border-b border-borderPrimary bg-bgPrimary text-textSecondary hover:bg-bgSecondary"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-table-search-1"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="flex items-center whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                    >
                      <img
                        src={invoice.photoLink}
                        className="mx-2 h-[40px] w-[40px] rounded-full"
                        alt="#"
                      />
                      {invoice.studentName}
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.scholarshipName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.scholarshipType}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.startDate}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {invoice.expirationDate}
                    </td>
                    <td className="flex items-center gap-2 whitespace-nowrap px-6 py-4">
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
                        href={`/fees-management/scholarship/${invoice.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar"
                          ? "تعديل"
                          : currentLanguage === "fr"
                            ? "Modifier"
                            : "Edit"}
                      </Link>
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

export default Scholarship;
