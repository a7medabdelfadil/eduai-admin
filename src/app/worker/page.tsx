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

  useEffect(() => {
    if (data) console.log("Response Data:", data);
    if (error) console.log("Error:", error);
  }, [data, error]);

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
        } bg-transstudent relative mx-3 mt-10 h-screen overflow-x-auto sm:rounded-lg`}
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
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Name"
                    : currentLanguage === "ar"
                      ? "الاسم"
                      : currentLanguage === "fr"
                        ? "Nom"
                        : "Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "ID"
                    : currentLanguage === "ar"
                      ? "الرقم"
                      : currentLanguage === "fr"
                        ? "ID"
                        : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                      ? "الجنس"
                      : currentLanguage === "fr"
                        ? "Genre"
                        : "Gender"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Nationality"
                    : currentLanguage === "ar"
                      ? "الجنسية"
                      : currentLanguage === "fr"
                        ? "Nationalité"
                        : "Nationality"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Email"
                        : "Email"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                      ? "الموبايل"
                      : currentLanguage === "fr"
                        ? "Mobile"
                        : "Mobile"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "View"
                    : currentLanguage === "ar"
                      ? "عرض"
                      : currentLanguage === "fr"
                        ? "Voir"
                        : "View"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
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
                .map((worker: Worker) => (
                  <tr
                    key={worker.id}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
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
                      className="flex items-center gap-2 whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                    >
                      <div className="w-[50px]">
                        {worker.picture == null ? (
                          <img
                            src="/images/userr.png"
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        ) : (
                          <img
                            src={worker.picture}
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        )}
                      </div>
                      <p className="text-textSecondart"> {worker.name} </p>
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">{worker.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {worker.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {worker.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {worker.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {worker.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
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
                    <td className="whitespace-nowrap px-6 py-4">
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
    </>
  );
};

export default Worker;
