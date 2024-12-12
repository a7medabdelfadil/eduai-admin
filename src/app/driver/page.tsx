/* eslint-disable @next/next/no-img-element */
"use client";
import Spinner from "@/components/spinner";
import {
  useGetAllDriversQuery,
  useDeleteDriversMutation,
} from "@/features/User-Management/driverApi";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import BreadCrumbs from "@/components/BreadCrumbs";

// import Sheet from "@/components/sheet";
// import DriverInfo from "@/components/driverInfo";

const Driver = () => {
  //   const [isSheetOpen, setIsSheetOpen] = useState(false);

  //   const handleOpen = () => setIsSheetOpen(true);
  //   const handleClose = () => setIsSheetOpen(false);
  //     <div className="p-8">
  //     <button
  //       className="bg-blue-500 text-white px-4 py-2 rounded"
  //       onClick={handleOpen}
  //     >
  //       Open Sheet
  //     </button>
  //
  //   </div>
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "User Management",
      nameAr: "إدارة المستخدمين",
      nameFr: "Gestion des utilisateurs",
      href: "/user-management",
    },
    {
      nameEn: "Driver",
      nameAr: "السائق",
      nameFr: "Conducteurs",
      href: "/driver",
    },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onPageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const booleanValue = useSelector((state: RootState) => state.boolean.value); // sidebar
  type Driver = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllDriversQuery({
    archived: "false",
    page: currentPage,
    size: rowsPerPage,
  });
  const onElementChange = (ele: SetStateAction<number>) => {
    setRowsPerPage(ele);
    setCurrentPage(0);
  };
  const [selectAll, setSelectAll] = useState(false);
  const [deleteDrivers] = useDeleteDriversMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteDrivers({
        id: id,
        lock: "true",
      }).unwrap();
      toast.success(`Driver with ID ${id} Locked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to delete the Driver");
    }
  };

  useEffect(() => {
    if (data) console.log("Response Data:", data);
    if (error) console.log("Error:", error);
  }, [data, error]);

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
                  className="size-4 flex-shrink-0 text-textSecondary"
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
              href="/add-new-driver"
              className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ New Driver"
                : currentLanguage === "ar"
                  ? "+ سائق جديد"
                  : currentLanguage === "fr"
                    ? "+ Nouveau Chauffeur"
                    : "+ New Driver"}{" "}
              {/* Default to English */}
            </Link>
          </div>
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
                      className="-gray-800 h-4 w-4 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-blue-500"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Name"
                    : currentLanguage === "ar"
                      ? "الاسم"
                      : currentLanguage === "fr"
                        ? "Nom"
                        : "Name"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "ID"
                    : currentLanguage === "ar"
                      ? "الرقم"
                      : currentLanguage === "fr"
                        ? "Identifiant"
                        : "ID"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                      ? "الجنس"
                      : currentLanguage === "fr"
                        ? "Genre"
                        : "Gender"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Nationality"
                    : currentLanguage === "ar"
                      ? "الجنسية"
                      : currentLanguage === "fr"
                        ? "Nationalité"
                        : "Nationality"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Courriel"
                        : "Email"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                      ? "الجوال"
                      : currentLanguage === "fr"
                        ? "Mobile"
                        : "Mobile"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "View"
                    : currentLanguage === "ar"
                      ? "عرض"
                      : currentLanguage === "fr"
                        ? "Voir"
                        : "View"}{" "}
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
              </tr>
            </thead>
            <tbody>
              {data?.data.content
                .filter((driver: Driver) => {
                  return search.toLocaleLowerCase() === ""
                    ? driver
                    : driver.name.toLocaleLowerCase().includes(search);
                })
                .map((driver: Driver) => (
                  <tr
                    key={driver.id}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                  >
                    {/* onClick={handleOpen} */}
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
                      className="flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-textPrimary transition-colors duration-300"
                    >
                      <div className="w-[50px]">
                        {driver.picture == null ? (
                          <img
                            src="/images/userr.png"
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        ) : (
                          <img
                            src={driver.picture}
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        )}
                      </div>
                      <p className="text-textSecondary hover:text-primary">
                        {driver.name}
                      </p>
                    </th>

                    <td className="whitespace-nowrap px-6 py-4">{driver.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {driver.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {driver.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {driver.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {driver.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/driver/view-driver/${driver.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {currentLanguage === "en"
                          ? "View"
                          : currentLanguage === "ar"
                            ? "عرض"
                            : currentLanguage === "fr"
                              ? "Voir"
                              : "View"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      >
                        {currentLanguage === "en"
                          ? "Lock"
                          : currentLanguage === "ar"
                            ? "قفل"
                            : currentLanguage === "fr"
                              ? "Verrouiller"
                              : "Lock"}
                      </button>
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
        <div className="relative overflow-auto">
          <Pagination
            totalPages={data?.data.totalPages}
            elementsPerPage={rowsPerPage}
            onChangeElementsPerPage={onElementChange}
            currentPage={currentPage}
            onChangePage={onPageChange}
          />
        </div>
      </div>
      {/* <Sheet isOpen={isSheetOpen} onClose={handleClose}>
              <h2 className="text-2xl font-semibold mb-4">Sheet Content</h2>
              <DriverInfo data={data} />
         </Sheet> */}
    </>
  );
};

export default Driver;
