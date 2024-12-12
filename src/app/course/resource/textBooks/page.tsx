/* eslint-disable @next/next/no-img-element */
"use client";
import Soon from "@/components/soon";
import Link from "next/link";
import { useState, useEffect } from "react"; // Import useState and useEffect hooks
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";

const TextBooks = () => {
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "أكاديمي",
      nameFr: "Académique",
      href: "/",
    },
    {
      nameEn: "Course",
      nameAr: "الدورة",
      nameFr: "Cours",
      href: "/course",
    },
    {
      nameEn: "TextBooks",
      nameAr: "الكتب الدراسية",
      nameFr: "Manuels scolaires",
      href: "/course/resource/textBooks",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  const [selectAll, setSelectAll] = useState(false); // State to track whether select all checkbox is checked

  // Function to handle click on select all checkbox
  const handleSelectAll = () => {
    setSelectAll(!selectAll); // Toggle select all state
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    ); // Select all checkboxes except select all checkbox
    checkboxes.forEach(checkbox => {
      checkbox.checked = !selectAll; // Set checked state of each checkbox based on select all state
    });
  };

  useEffect(() => {
    // Function to handle click on other checkboxes
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

    // Add event listeners to other checkboxes
    const otherCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)',
    );
    otherCheckboxes.forEach(checkbox => {
      checkbox.addEventListener("change", handleOtherCheckboxes);
    });

    return () => {
      // Remove event listeners when component unmounts
      otherCheckboxes.forEach(checkbox => {
        checkbox.removeEventListener("change", handleOtherCheckboxes);
      });
    };
  }, []);

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
      {/* <Soon /> */}
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={` ${
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
              href="/course/resource/textBooks/add-textBooks"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة كتب دراسية"
                : currentLanguage === "fr"
                  ? "Ajouter des manuels scolaires"
                  : "Add TextBooks"}
            </Link>
          </div>
        </div>
        <div className="justify-left mb-5 ml-4 flex gap-5 text-[18px] font-semibold">
          <Link href="/course/resource">
            {currentLanguage === "ar"
              ? "الموارد الرقمية"
              : currentLanguage === "fr"
                ? "Ressources numériques"
                : "Digital Resources"}
          </Link>
          <Link href="/course/resource/equipment">
            {currentLanguage === "ar"
              ? "المعدات"
              : currentLanguage === "fr"
                ? "Équipement"
                : "Equipment"}
          </Link>
          <Link href="/course/resource/facilities">
            {currentLanguage === "ar"
              ? "المرافق"
              : currentLanguage === "fr"
                ? "Installations"
                : "Facilities"}
          </Link>
          <Link href="/course/resource/instructional-materials">
            {currentLanguage === "ar"
              ? "المواد التعليمية"
              : currentLanguage === "fr"
                ? "Matériel pédagogique"
                : "Instructional Materials"}
          </Link>
          <Link
            href="/course/resource/textBooks"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "الكتب الدراسية"
              : currentLanguage === "fr"
                ? "Manuels"
                : "Textbooks"}
          </Link>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
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
                  {currentLanguage === "ar"
                    ? "الاسم"
                    : currentLanguage === "fr"
                      ? "Nom"
                      : "Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الإجمالي"
                    : currentLanguage === "fr"
                      ? "Nombre total"
                      : "Total Number"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "عدد الإضافات الأخيرة"
                    : currentLanguage === "fr"
                      ? "Nombre de la dernière addition"
                      : "Number of latest addition"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "عدد السحوبات الأخيرة"
                    : currentLanguage === "fr"
                      ? "Nombre du dernier retrait"
                      : "Number of latest pulling"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "آخر تحديث"
                    : currentLanguage === "fr"
                      ? "Dernière mise à jour"
                      : "Last update"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الحالة"
                    : currentLanguage === "fr"
                      ? "Statut"
                      : "Status"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تعديل"
                    : currentLanguage === "fr"
                      ? "Modifier"
                      : "Edit"}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
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
                    src="/images/me.jpg"
                    className="mx-2 h-[40px] w-[40px] rounded-full"
                    alt="#"
                  />
                  Nahda
                </th>
                <td className="whitespace-nowrap px-6 py-4">1321312</td>
                <td className="whitespace-nowrap px-6 py-4">Male</td>
                <td className="whitespace-nowrap px-6 py-4">5515151</td>
                <td className="whitespace-nowrap px-6 py-4">002050030</td>
                <td className="whitespace-nowrap px-6 py-4">This is text</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Link
                    href="/course/resource/textBooks/edit-textBooks"
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
              <tr className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary">
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
                    src="/images/me.jpg"
                    className="mx-2 h-[40px] w-[40px] rounded-full"
                    alt="#"
                  />
                  Nahda
                </th>
                <td className="whitespace-nowrap px-6 py-4">1321312</td>
                <td className="whitespace-nowrap px-6 py-4">Male</td>
                <td className="whitespace-nowrap px-6 py-4">5513131s</td>
                <td className="whitespace-nowrap px-6 py-4">00515</td>
                <td className="whitespace-nowrap px-6 py-4">This is text</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <Link
                    href="/course/resource/textBooks/edit-textBooks"
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default TextBooks;
