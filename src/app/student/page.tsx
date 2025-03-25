/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import {
  useDeleteStudentsMutation,
  useGetAllStudentsQuery,
  useLazyExportStudentsFileQuery
} from "@/features/User-Management/studentApi";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";

const Student = () => {
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
      nameEn: "Student",
      nameAr: "طالب",
      nameFr: "Étudiant",
      href: "/student",
    },
  ];
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
  };

  const [selectAll, setSelectAll] = useState(false);
  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Student = Record<string, any>;
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // New states to hold selected values of gender & classroom
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");

  // Fetching data
  const { data, error, isLoading, refetch } = useGetAllStudentsQuery({
    archived: "false",
    page: currentPage,
    size: rowsPerPage,
    graduated: "false",
    gender: selectedGender.toUpperCase(),
    classRoom: selectedClassroom,
  });
  const [isLoadingDownload, setIsLoadingDownload] = useState<boolean>(false);

  const handleExport = async (params: any) => {
    // Add loading state

    try {
      setIsLoadingDownload(true); // Start loading
      
      const queryParams = new URLSearchParams({
        size: params.size?.toString() || '',
        page: params.page?.toString() || '',
        archived: params.archived?.toString() || '',
        graduated: params.graduated?.toString() || '',
        'search-word': params.searchWord || '',
        genders: selectedGender.toUpperCase(),
        'classroom-names': params.classroomNames?.join(',') || '',
        address: params.address || ''
      });
  
      const response = await fetch(
        `${baseUrl}/api/v1/export/student/excel?${queryParams}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie("token")}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error('Export failed');
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'students.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
  
    } catch (error) {
      toast.error("Failed to export students data");
      console.error('Export error:', error);
    } finally {
      setIsLoadingDownload(false); // End loading regardless of success or failure
    }
};
  
  // Usage example:
  

  const onPageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page);
  };
  const onElementChange = (ele: SetStateAction<number>) => {
    setRowsPerPage(ele);
    setCurrentPage(0);
  };

  const [deleteStudents] = useDeleteStudentsMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteStudents({
        id: id,
        lock: "true",
      }).unwrap();
      toast.success(`Student with ID ${id} Locked successfully`);
      void refetch();
    } catch {
      toast.error("Failed to lock the Student");
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = !selectAll;
    });
  };

  useEffect(() => {
    const handleOtherCheckboxes = () => {
      const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
        'input[type="checkbox"]:not(#checkbox-all-search)'
      );
      const allChecked = Array.from(allCheckboxes).every(
        (checkbox) => checkbox.checked
      );
      const selectAllCheckbox = document.getElementById(
        "checkbox-all-search"
      ) as HTMLInputElement | null;
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = allChecked;
        setSelectAll(allChecked);
      }
    };

    const otherCheckboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]:not(#checkbox-all-search)'
    );
    otherCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", handleOtherCheckboxes);
    });

    return () => {
      otherCheckboxes.forEach((checkbox) => {
        checkbox.removeEventListener("change", handleOtherCheckboxes);
      });
    };
  }, []);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
  );

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  // -----------------------------
  // Create a unique list of classrooms from backend data
  // -----------------------------
  const uniqueClassrooms = Array.from(
    new Set(
      (data?.data.content || [])
        // Take only classroomName that is not empty or null
        .map((student: Student) => student.classroomName)
        .filter((classroomName: string | null) => !!classroomName)
    )
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
        <Link
          href="/student"
          className="text-blue-500 underline"
        >
          {currentLanguage === "ar"
            ? "طالب نشط"
            : currentLanguage === "fr"
            ? "Étudiant actif"
            : "Active Student"}
        </Link>
        <Link href="/student/graduated">
          {currentLanguage === "ar"
            ? "طالب خريج"
            : currentLanguage === "fr"
            ? "Étudiant diplômé"
            : "Graduate Student"}
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
        } bg-transstudent relative mx-3 mt-10 h-screen overflow-x-auto sm:rounded-lg`}
      >
        {/* SEARCH + FILTERS + NEW STUDENT BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-center">
          {/* Search Box */}
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
                onChange={(e) => setSearch(e.target.value)}
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

          {/* Filter by Gender */}
          <div className="mb-3 flex items-center gap-5 flex-wrap">
            <label
              htmlFor="genderFilter"
              className="block text-sm font-semibold text-gray-700"
            >
              {currentLanguage === "en"
                ? "Gender"
                : currentLanguage === "ar"
                ? "الجنس"
                : "Genre"}
            </label>
            <select
              id="genderFilter"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-40 rounded-md border px-2 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">
                {currentLanguage === "en"
                  ? "All"
                  : currentLanguage === "ar"
                  ? "الكل"
                  : "Tous"}
              </option>
              <option value="male">
                {currentLanguage === "en"
                  ? "Male"
                  : currentLanguage === "ar"
                  ? "ذكر"
                  : "Masculin"}
              </option>
              <option value="female">
                {currentLanguage === "en"
                  ? "Female"
                  : currentLanguage === "ar"
                  ? "أنثى"
                  : "Féminin"}
              </option>
            </select>
            <label
              htmlFor="classroomFilter"
              className="block text-sm font-semibold text-gray-700"
            >
              {currentLanguage === "en"
                ? "Classroom"
                : currentLanguage === "ar"
                ? "الفصل الدراسي"
                : "Classe"}
            </label>
            <select
              id="classroomFilter"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              className="w-40 rounded-md border px-2 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">
                {currentLanguage === "en"
                  ? "All"
                  : currentLanguage === "ar"
                  ? "الكل"
                  : "Tous"}
              </option>
              {uniqueClassrooms.map((classroom: any) => (
                <option key={classroom} value={classroom}>
                  {classroom}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Classroom (Dynamically Populated) */}



          {/* New Student Button */}
          <div className="flex justify-center">
            
          <button
              onClick={()=>handleExport({
                size: rowsPerPage,
                page: currentPage,
                archived: false,
                graduated: false
              })}
              className="mx-3 mb-5 w-[190px] flex justify-center whitespace-nowrap rounded-xl bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in border border-primary hover:shadow-xl"
            >
              {
              isLoadingDownload ? <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div> : currentLanguage === "en"
                ? "Export Data"
                : currentLanguage === "ar"
                ? "تصدير البيانات"
                : "Exporter les données"
            }
              
            </button>

            <Link
              href="/add-new-student"
              className="mx-3 mb-5 w-[190px] whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ New Student"
                : currentLanguage === "ar"
                ? "+ طالب جديد"
                : "+ Nouvel Élève"}
            </Link>
          </div>
        </div>
        {/* END OF SEARCH + FILTERS + NEW STUDENT BUTTON */}

        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full overflow-x-auto text-left text-sm text-textSecondary rtl:text-right">
            <thead className="bg-thead text-xs uppercase text-textPrimary">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
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
                    : "Nom"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "ID"
                    : currentLanguage === "ar"
                    ? "الرقم التعريفي"
                    : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                    ? "الجنس"
                    : "Genre"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Nationality"
                    : currentLanguage === "ar"
                    ? "الجنسية"
                    : "Nationalité"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                    ? "البريد الإلكتروني"
                    : "E-mail"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                    ? "الهاتف المحمول"
                    : "Mobile"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Classroom"
                    : currentLanguage === "ar"
                    ? "الفصل الدراسي"
                    : currentLanguage === "fr"
                    ? "Classe"
                    : "Classe"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "View"
                    : currentLanguage === "ar"
                    ? "عرض"
                    : "Voir"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-3">
                  {currentLanguage === "en"
                    ? "Action"
                    : currentLanguage === "ar"
                    ? "الإجراء"
                    : "Action"}
                </th>
              </tr>
            </thead>

            <tbody>
              {data?.data.content
                .filter((student: Student) => {
                  return search.toLocaleLowerCase() === ""
                    ? student
                    : student.name.toLocaleLowerCase().includes(search);
                }).map((student: Student) => (
                  <tr
                    key={student.id}
                    className="border-b border-borderPrimary bg-bgPrimary hover:bg-bgSecondary"
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${student.id}`}
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
                        {student.picture == null ? (
                          <img
                            src="/images/userr.png"
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        ) : (
                          <img
                            src={student.picture}
                            className="mx-2 h-[40px] w-[40px] rounded-full"
                            alt="#"
                          />
                        )}
                      </div>
                      <p className="text-textSecondary">
                        {String(student.name)}
                      </p>
                    </th>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.classroomName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/student/view-student/${student.id}`}
                        className="font-medium text-primary hover:underline"
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
                        onClick={() => handleDelete(student.id)}
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
                : "Aucune donnée"}
            </div>
          )}
        </div>
        <div className="relative overflow-auto">
          <Pagination
            totalPages={data?.data.totalPagesCount}
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

export default Student;
