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
import { baseUrl } from "@/components/BaseURL";
import { Text } from "@/components/Text";
import { HiDownload } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";

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

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  console.log("👾 ~ Driver ~ selectedDriver:", selectedDriver);
  const [showModal, setShowModal] = useState(false);

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

  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const handleExport = async (params: any) => {
    // Add loading state

    try {
      setIsLoadingDownload(true); // Start loading

      const queryParams = new URLSearchParams({
        size: params.size?.toString() || "",
        type: "DRIVER",
        page: params.page?.toString() || "",
        archived: params.archived?.toString() || "",
        graduated: params.graduated?.toString() || "",
        "search-word": params.searchWord || "",
        genders: params.genders?.join(",") || "",
        "classroom-names": params.classroomNames?.join(",") || "",
        address: params.address || "",
      });

      const response = await fetch(
        `${baseUrl}/api/v1/export/employee/excel?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "drivers.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Failed to export students data");
      console.error("Export error:", error);
    } finally {
      setIsLoadingDownload(false); // End loading regardless of success or failure
    }
  };
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

  const getAgeFromBirthDate = (birthDate: string | null) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

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
        } justify-left mb-4 ml-4 mt-5 flex flex-col text-[20px] font-medium`}
      >
        <div className="flex items-center justify-between">
          <Text font="bold" size="3xl">
            {currentLanguage === "ar"
              ? "جميع السائقين"
              : currentLanguage === "fr"
                ? "Tous les conducteurs"
                : "All Drivers"}
          </Text>
          <button
            onClick={() =>
              handleExport({
                size: rowsPerPage,
                page: currentPage,
                archived: false,
                graduated: false,
              })
            }
            className="mx-3 mb-5 flex w-fit justify-center whitespace-nowrap rounded-xl border border-primary bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in hover:shadow-xl"
          >
            <HiDownload
              size={20}
              className={`${currentLanguage == "ar" ? "ml-2" : "mr-2"}`}
            />
            {isLoadingDownload
              ? currentLanguage === "ar"
                ? "جارٍ التنزيل..."
                : currentLanguage === "fr"
                  ? "Téléchargement..."
                  : "Downloading..."
              : currentLanguage === "ar"
                ? "تحميل جميع السائقين"
                : currentLanguage === "fr"
                  ? "Télécharger tous les conducteurs"
                  : "Download All Drivers"}
          </button>
        </div>
        <div className="max-[502px] :justify-center flex justify-between rounded-t-xl bg-bgPrimary p-4 text-center max-[502px]:grid">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  id="icon"
                  name="icon"
                  className="border-borderSecondary block w-full rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-borderPrimary"
                  placeholder={
                    currentLanguage === "ar"
                      ? "ابحث عن أي شيء"
                      : currentLanguage === "fr"
                        ? "Rechercher n'importe quoi"
                        : "Search anything"
                  }
                />
                <span className="min-w-[120px] text-primary">
                  {
                    data?.data.content.filter((driver: Driver) => {
                      return search.toLocaleLowerCase() === ""
                        ? driver
                        : driver.name.toLocaleLowerCase().includes(search);
                    }).length
                  }{" "}
                  Result(s)
                </span>
              </div>
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
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Name"
                    : currentLanguage === "ar"
                      ? "الاسم"
                      : currentLanguage === "fr"
                        ? "Nom"
                        : "Name"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "ID"
                    : currentLanguage === "ar"
                      ? "الرقم"
                      : currentLanguage === "fr"
                        ? "Identifiant"
                        : "ID"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                      ? "الجنس"
                      : currentLanguage === "fr"
                        ? "Genre"
                        : "Gender"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Nationality"
                    : currentLanguage === "ar"
                      ? "الجنسية"
                      : currentLanguage === "fr"
                        ? "Nationalité"
                        : "Nationality"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Courriel"
                        : "Email"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                      ? "الجوال"
                      : currentLanguage === "fr"
                        ? "Mobile"
                        : "Mobile"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "View"
                    : currentLanguage === "ar"
                      ? "عرض"
                      : currentLanguage === "fr"
                        ? "Voir"
                        : "View"}{" "}
                  {/* Default to English */}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
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
                .map((driver: Driver, index: number) => (
                  <tr
                    key={driver.id}
                    onClick={() => {
                      setSelectedDriver(driver);
                      setShowModal(true);
                    }}
                    className={`cursor-pointer border-b border-borderPrimary text-textPrimary ${
                      index % 2 === 0 ? "bg-bgRowTable" : "bg-bgPrimary"
                    }`}
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
                      className="whitespace-nowrap px-6 py-1 align-middle font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-[50px]">
                          <img
                            src={driver.picture ?? "/images/userr.png"}
                            className="mx-2 h-[25px] w-[25px] rounded-full"
                            alt="#"
                          />
                        </div>
                        <p className="text-textPrimary">
                          {String(driver.name)}
                        </p>
                      </div>
                    </th>

                    <td className="whitespace-nowrap px-6 py-1">{driver.id}</td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {driver.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {driver.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {driver.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {driver.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
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
                    <td className="whitespace-nowrap px-6 py-1">
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
      {showModal && selectedDriver && (
        <div
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-[2000] flex justify-end bg-black/30"
        >
          <div
            onClick={e => e.stopPropagation()}
            className={`h-full w-full max-w-md overflow-y-auto bg-bgPrimary ${currentLanguage === "ar" ? "rounded-r-xl" : "rounded-l-xl"} p-6 shadow-xl sm:w-[450px]`}
          >
            {/* Close Button */}
            <a
              href={`/edit-driver/${selectedDriver.id}`}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              <MdEdit />
            </a>

            {/* Header */}
            <h2 className="mb-4 text-xl font-bold">
              {currentLanguage === "ar"
                ? "معلومات السائق"
                : currentLanguage === "fr"
                  ? "Informations du conducteur"
                  : "Driver Information"}
            </h2>

            {/* Profile */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={selectedDriver.picture ?? "/images/userr.png"}
                alt="driver"
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="text-lg font-semibold">{selectedDriver.name}</p>
              <p className="text-sm text-gray-500">{selectedDriver.id}</p>
            </div>

            {/* Basic Details */}
            <div className="mt-6 space-y-2 text-sm text-textSecondary">
              {[
                {
                  label: "Age",
                  value: getAgeFromBirthDate(selectedDriver.birthDate),
                },
                { label: "Gender", value: selectedDriver.gender ?? "N/A" },
                { label: "Religion", value: selectedDriver.religion ?? "N/A" },
                { label: "Mobile", value: selectedDriver.phoneNumber },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[150px_10px_1fr] gap-1"
                >
                  <span className="font-medium text-textPrimary">
                    {item.label}
                  </span>
                  <span className="text-textPrimary">:</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Driver;
