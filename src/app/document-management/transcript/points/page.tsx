"use client";
import Soon from "@/components/soon";
import Link from "next/link";
import { useState, useEffect } from "react"; // Import useState and useEffect hooks
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useGetAllListPointsQuery } from "@/features/Document-Management/certificatesApi";

const Points = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Document Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/document-management",
    },
    {
      nameEn: "Points",
      nameAr: "النقاط",
      nameFr: "Points",
      href: "/document-management/transcript/points",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value); // sidebar
  const { data, isLoading } = useGetAllListPointsQuery(null);
  const [selectAll, setSelectAll] = useState(false); // State to track whether select all checkbox is checked
  const [search, setSearch] = useState("");
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
        className={`${
          currentLanguage === "ar"
            ? booleanValue
              ? "lg:mr-[100px]"
              : "lg:mr-[270px]"
            : booleanValue
              ? "lg:ml-[100px]"
              : "lg:ml-[270px]"
        } justify-left mb-4 ml-4 mt-5 flex gap-5 text-[20px] font-medium`}
      >
        <Link href="/document-management/transcript">
          {currentLanguage === "ar"
            ? "قائمة الدورات"
            : currentLanguage === "fr"
              ? "Liste des cours"
              : "Course List"}
        </Link>
        <Link
          href="/document-management/transcript/points"
          className="text-blue-500 underline"
        >
          {currentLanguage === "ar"
            ? "قائمة النقاط"
            : currentLanguage === "fr"
              ? "Liste des points"
              : "List Of Points"}
        </Link>
      </div>
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
        } relative mx-3 mt-10 overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-secondary/50"
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
                className="block w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
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
        </div>
        <table className="w-full overflow-x-auto text-left text-sm text-gray-500 rtl:text-right">
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
                  ? "الرقم التعريفي"
                  : currentLanguage === "fr"
                    ? "ID"
                    : "ID"}
              </th>

              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "الجنس"
                  : currentLanguage === "fr"
                    ? "Genre"
                    : "Gender"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "العمر"
                  : currentLanguage === "fr"
                    ? "Âge"
                    : "Age"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "مستوى الدراسة"
                  : currentLanguage === "fr"
                    ? "Niveau d'étude"
                    : "study Level"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "المرحلة التعليمية"
                  : currentLanguage === "fr"
                    ? "Niveau d'éducation"
                    : "Educational Stage"}
              </th>
              <th scope="col" className="whitespace-nowrap px-6 py-3">
                {currentLanguage === "ar"
                  ? "عرض"
                  : currentLanguage === "fr"
                    ? "Voir"
                    : "View"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data.content
              .filter((employee: any) => {
                return search.toLocaleLowerCase() === ""
                  ? employee
                  : employee.studentName.toLocaleLowerCase().includes(search);
              })
              .map((point: any) => (
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
                    className="flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-textSecondary"
                  >
                    <div className="w-[50px]">
                      {point.photoLink == null ? (
                        <img
                          src="/images/userr.png"
                          className="mx-2 h-[40px] w-[40px] rounded-full"
                          alt="#"
                        />
                      ) : (
                        <img
                          src={point.photoLink}
                          className="mx-2 h-[40px] w-[40px] rounded-full"
                          alt="#"
                        />
                      )}
                    </div>
                    <p className="text-textSecondary">{point.studentName}</p>
                  </th>
                  <td className="whitespace-nowrap px-6 py-4">
                    {point.studentId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {point.gender}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{point.age}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {point.studyLevel}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {point.studyStage}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Link
                      href={`/document-management/transcript/points/${point.studentId}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
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
                : "Aucune donnée"}
          </div>
        )}
      </div>
    </>
  );
};

export default Points;
