/* eslint-disable @next/next/no-img-element */
"use client";
import Pagination from "@/components/pagination";
import Spinner from "@/components/spinner";
import {
  useDeleteWorkersMutation,
  useGetAllWorkersQuery,
} from "@/features/User-Management/workerApi";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";
import { Text } from "@/components/Text";
import { HiDownload } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";

const Worker = () => {
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
      nameEn: "Worker",
      nameAr: "عامل",
      nameFr: "Travailleur",
      href: "/worker",
    },
  ];

  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  console.log("👾 ~ Worker ~ selectedWorker:", selectedWorker);
  const [showModal, setShowModal] = useState(false);

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Worker = Record<string, any>;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading, refetch } = useGetAllWorkersQuery({
    archived: "false",
    page: currentPage,
    size: rowsPerPage,
  });
  const [selectAll, setSelectAll] = useState(false);

  const onPageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const onElementChange = (ele: SetStateAction<number>) => {
    setRowsPerPage(ele);
    setCurrentPage(0);
  };
  const [deleteWorker] = useDeleteWorkersMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteWorker({
        id: id,
        lock: "true",
      }).unwrap();
      toast.success(`Worker with ID ${id} Locked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to lock the Worker");
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
        type: "WORKER",
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
      a.download = "workers.xlsx";
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

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB");
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
        } relative mx-3 overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="flex items-center justify-between">
          <Text font="bold" size="3xl">
            {currentLanguage === "ar"
              ? "جميع العمال"
              : currentLanguage === "fr"
                ? "Tous les ouvriers"
                : "All Workers"}
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
              className={`${currentLanguage == "ar" ? "ml-2" : "mr-2"} mt-1`}
            />
            {isLoadingDownload
              ? currentLanguage === "ar"
                ? "جارٍ التنزيل..."
                : currentLanguage === "fr"
                  ? "Téléchargement..."
                  : "Downloading..."
              : currentLanguage === "ar"
                ? "تحميل جميع العمال"
                : currentLanguage === "fr"
                  ? "Télécharger tous les ouvriers"
                  : "Download All Workers"}
          </button>
        </div>
        <div className="flex justify-between rounded-t-xl bg-bgPrimary p-4 text-center max-[502px]:grid max-[502px]:justify-center">
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
                    data?.data.content.filter((worker: Worker) => {
                      return search.toLocaleLowerCase() === ""
                        ? worker
                        : worker.name.toLocaleLowerCase().includes(search);
                    }).length
                  }{" "}
                  Result(s)
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/add-new-worker"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ Add new Worker"
                : currentLanguage === "ar"
                  ? "+ إضافة عامل جديد"
                  : currentLanguage === "fr"
                    ? "+ Ajouter un nouveau Travailleur"
                    : "+ Add new Worker"}
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
                      className="-gray-800 h-4 w-4 rounded border-borderPrimary bg-bgPrimary text-blue-600 focus:ring-2 focus:ring-hover"
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "ar"
                    ? "الاسم الكامل"
                    : currentLanguage === "fr"
                      ? "Nom complet"
                      : "Full Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "ID"
                    : currentLanguage === "ar"
                      ? "الرقم"
                      : currentLanguage === "fr"
                        ? "ID"
                        : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                      ? "الجنس"
                      : currentLanguage === "fr"
                        ? "Genre"
                        : "Gender"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Nationality"
                    : currentLanguage === "ar"
                      ? "الجنسية"
                      : currentLanguage === "fr"
                        ? "Nationalité"
                        : "Nationality"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Email"
                        : "Email"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                      ? "الموبايل"
                      : currentLanguage === "fr"
                        ? "Mobile"
                        : "Mobile"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "View"
                    : currentLanguage === "ar"
                      ? "عرض"
                      : currentLanguage === "fr"
                        ? "Voir"
                        : "View"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Action"
                    : currentLanguage === "ar"
                      ? "الإجراء"
                      : currentLanguage === "fr"
                        ? "Action"
                        : "Action"}
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.data.content
                .filter((worker: Worker) => {
                  return search.toLocaleLowerCase() === ""
                    ? worker
                    : worker.name.toLocaleLowerCase().includes(search);
                })
                .map((worker: Worker, index: number) => (
                  <tr
                    key={worker.id}
                    onClick={() => {
                      setSelectedWorker(worker);
                      setShowModal(true);
                    }}
                    className={`cursor-pointer border-b border-borderPrimary text-textPrimary ${
                      index % 2 === 0 ? "bg-bgRowTable" : "bg-bgPrimary"
                    }`}
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
                      className="whitespace-nowrap px-6 py-1 align-middle font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-[50px]">
                          <img
                            src={worker.picture ?? "/images/userr.png"}
                            className="mx-2 h-[25px] w-[25px] rounded-full"
                            alt="#"
                          />
                        </div>
                        <p className="text-textPrimary">
                          {String(worker.name)}
                        </p>
                      </div>
                    </th>
                    <td className="whitespace-nowrap px-6 py-1">{worker.id}</td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {worker.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {worker.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {worker.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {worker.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      <Link
                        href={`/worker/view-worker/${worker.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "en"
                          ? "View"
                          : currentLanguage === "ar"
                            ? "عرض"
                            : "Voir"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      <button
                        onClick={() => handleDelete(worker.id)}
                        className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      >
                        {currentLanguage === "en"
                          ? "Lock"
                          : currentLanguage === "ar"
                            ? "قفل"
                            : "Verrouiller"}
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
                    ? "Aucune donnée"
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
      {showModal && selectedWorker && (
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
              href={`/edit-worker/${selectedWorker.id}`}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              <MdEdit />
            </a>

            {/* Header */}
            <h2 className="mb-4 text-xl font-bold">
              {currentLanguage === "ar"
                ? "معلومات الموظف"
                : currentLanguage === "fr"
                  ? "Informations de l'employé"
                  : "Employee Information"}
            </h2>

            {/* Profile */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={selectedWorker.picture ?? "/images/userr.png"}
                alt="employee"
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="text-lg font-semibold">{selectedWorker.name}</p>
              <p className="text-sm text-gray-500">{selectedWorker.id}</p>
            </div>

            {/* Basic Details */}
            <div className="mt-6 space-y-2 text-sm text-textSecondary">
              {[
                {
                  label: "Age",
                  value: getAgeFromBirthDate(selectedWorker.birthDate),
                },
                { label: "Gender", value: selectedWorker.gender ?? "N/A" },
                {
                  label: "Nationality",
                  value: selectedWorker.nationality ?? "N/A",
                },
                { label: "Religion", value: selectedWorker.religion ?? "N/A" },
                {
                  label: "Date Of Birth",
                  value: formatDate(selectedWorker.birthDate),
                },
                { label: "Email", value: selectedWorker.email },
                { label: "Mobile", value: selectedWorker.phoneNumber },
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

export default Worker;
