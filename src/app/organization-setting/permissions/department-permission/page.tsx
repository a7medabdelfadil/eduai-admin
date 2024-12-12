/* eslint-disable @next/next/no-img-element */
"use client";
import Spinner from "@/components/spinner";
import { useGetAllDepartmentPermissionPermissionsQuery } from "@/features/Organization-Setteings/departmentPermissionApi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";

const DepartmentPermission = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Department Permissions",
      nameAr: "صلاحيات المنظمة",
      nameFr: "Autorisations du département",
      href: "/organization-setting/permissions/department-permission",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  type DepartmentPermission = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading } =
    useGetAllDepartmentPermissionPermissionsQuery(null);
  const [selectAll, setSelectAll] = useState(false);

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
        <div className="justify-left mb-[80px] ml-4 mt-[50px] flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/organization-setting/permissions/department-permission"
            className="text-primary underline"
          >
            {currentLanguage === "ar"
              ? "القسم"
              : currentLanguage === "fr"
                ? "Département"
                : "Department"}
          </Link>
          <Link href="/organization-setting/permissions/employee-permission">
            {currentLanguage === "ar"
              ? "الموظف"
              : currentLanguage === "fr"
                ? "Employé"
                : "Employee"}
          </Link>
        </div>
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
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-primary focus:ring-primary disabled:pointer-events-none disabled:opacity-50"
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
              href="/organization-setting/permissions/add"
              className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة أذونات القسم"
                : currentLanguage === "fr"
                  ? "+ Ajouter les autorisations du département"
                  : "+ Add Department Permissions"}
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
                      className="-gray-800 h-4 w-4 rounded border-borderPrimary bg-bgPrimary text-primary focus:ring-2 focus:ring-primary"
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
                      : "id"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "أكاديمي كامل"
                    : currentLanguage === "fr"
                      ? "Est complet académique"
                      : "is Full Academic"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "إداري كامل"
                    : currentLanguage === "fr"
                      ? "Est complet administratif"
                      : "is Full Administration"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "تواصل كامل"
                    : currentLanguage === "fr"
                      ? "Est complet communication"
                      : "is Full Communication"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "عمليات كاملة"
                    : currentLanguage === "fr"
                      ? "Est complet opérations"
                      : "is Full Operations"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "عرض"
                    : currentLanguage === "fr"
                      ? "Vue"
                      : "view"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الإجراء"
                    : currentLanguage === "fr"
                      ? "Action"
                      : "Action"}
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data.content
                .filter((departmentPermission: DepartmentPermission) => {
                  return search.toLocaleLowerCase() === ""
                    ? departmentPermission
                    : departmentPermission.name
                        .toLocaleLowerCase()
                        .includes(search);
                })
                .map((departmentPermission: DepartmentPermission) => (
                  <tr
                    key={departmentPermission.id}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
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
                    <th scope="row" className="whitespace-nowrap px-6 py-4">
                      <p> {departmentPermission.name} </p>
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">
                      {departmentPermission.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {departmentPermission.isFullAcademic ? "Yes" : "No"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {departmentPermission.isFullAdministration ? "Yes" : "No"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {departmentPermission.isFullCommunication ? "Yes" : "No"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {departmentPermission.isFullOperations ? "Yes" : "No"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/organization-setting/permissions/department-permission/${departmentPermission.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {currentLanguage === "ar"
                          ? "تعديل"
                          : currentLanguage === "fr"
                            ? "Éditer"
                            : "edit"}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                        {currentLanguage === "ar"
                          ? "حذف"
                          : currentLanguage === "fr"
                            ? "Supprimer"
                            : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DepartmentPermission;
