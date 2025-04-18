/* eslint-disable @next/next/no-img-element */
"use client";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useGetAllComplainsQuery,
  useDeleteComplainsMutation,
} from "@/features/Organization-Setteings/complainApi";
const ComplaintParent = () => {
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
      nameEn: "Complaint",
      nameAr: "شكوى",
      nameFr: "Plainte",
      href: "/organization-setting/complaint",
    },
  ];

  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  type Department = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllComplainsQuery({
    type: "TEACHER_TO_STUDENT",
    approved: "",
  });
  const [selectAll, setSelectAll] = useState(false);



  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteComplainsMutation();

  const handleDelete = async (id: any) => {
    try {
      await deleteDepartment(id).unwrap();
      toast.success(`Complaint with ID ${id} deleted successfully`);
      refetch();
    } catch {
      toast.error("Failed to delete the Complaint");
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
            href="/organization-setting/complaint"
            className="text-primary underline"
          >
            {currentLanguage === "ar"
              ? "مدرس"
              : currentLanguage === "fr"
                ? "Professeur"
                : "Teacher"}
          </Link>
          <Link href="/organization-setting/complaint/parent">
            {currentLanguage === "ar"
              ? "الوالد"
              : currentLanguage === "fr"
                ? "Mère"
                : "Parent"}
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
                    ? "اسم المدرس "
                    : currentLanguage === "fr"
                      ? " Professeur Nom"
                      : "Teacher Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "اسم الطالب"
                    : currentLanguage === "fr"
                      ? "étudiant nom"
                      : "student Name"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الاختصار"
                    : currentLanguage === "fr"
                      ? "subject"
                      : "subject"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "ar"
                    ? "الرسالة"
                    : currentLanguage === "fr"
                      ? "message"
                      : "message"}
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
                .filter((Department: Department) => {
                  return search.toLocaleLowerCase() === ""
                    ? Department
                    : Department.name.toLocaleLowerCase().includes(search);
                })
                .map((Department: Department) => (
                  <tr
                    key={Department.id}
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
                      <p className="text-textSecondary">
                        {" "}
                        {Department.teacherName}{" "}
                      </p>
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">
                      {Department.studentName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {Department.subject}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {Department.message}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        disabled={isDeleting}
                        onClick={() => handleDelete(Department.id)}
                        className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                      >
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

export default ComplaintParent;
