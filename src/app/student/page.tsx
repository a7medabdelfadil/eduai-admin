/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import {
  useDeleteStudentsMutation,
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useLazyExportStudentsFileQuery,
} from "@/features/User-Management/studentApi";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Pagination from "@/components/pagination";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";
import { BiSearchAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { Text } from "@/components/Text";
import { HiDownload } from "react-icons/hi";

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

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: dataStudent,
    error: errorStudent,
    isLoading: isLoadingStudent,
  } = useGetStudentByIdQuery(selectedStudent?.id);

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
        size: params.size?.toString() || "",
        page: params.page?.toString() || "",
        archived: params.archived?.toString() || "",
        graduated: params.graduated?.toString() || "",
        "search-word": params.searchWord || "",
        genders: selectedGender.toUpperCase(),
        "classroom-names": params.classroomNames?.join(",") || "",
        address: params.address || "",
      });

      const response = await fetch(
        `${baseUrl}/api/v1/export/student/excel?${queryParams}`,
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
      a.download = "students.xlsx";
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

  // -----------------------------
  // Create a unique list of classrooms from backend data
  // -----------------------------
  const uniqueClassrooms = Array.from(
    new Set(
      (data?.data.content || [])
        // Take only classroomName that is not empty or null
        .map((student: Student) => student.classroomName)
        .filter((classroomName: string | null) => !!classroomName),
    ),
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
        } justify-left mb-4 ml-4 mt-5 flex flex-col gap-5 text-[20px] font-medium`}
      >
        <div className="flex items-center justify-between">
          <Text font="bold" size="3xl">
            {currentLanguage === "ar"
              ? "جميع الطلاب"
              : currentLanguage === "fr"
                ? "Tous les étudiants"
                : "All Students"}
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
            className="mx-3 mb-5 flex w-fit justify-center whitespace-nowrap rounded-xl border border-primary bg-bgPrimary p-4 text-sm text-primary duration-300 ease-in hover:shadow-xl"
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
              : currentLanguage === "en"
                ? "Download All Student"
                : currentLanguage === "ar"
                  ? "تصدير البيانات"
                  : "Exporter les données"}
          </button>
        </div>
        <div className="mx-10 flex gap-5">
          <Link href="/student" className="text-primary underline">
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
        } bg-transstudent relative mx-3 mt-2 h-screen overflow-x-auto sm:rounded-lg`}
      >
        {/* SEARCH + FILTERS + NEW STUDENT BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-bgPrimary p-4 rounded-t-xl text-center">
          {/* Search Box */}
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
                <span className="min-w-[100px] text-primary">
                  {
                    data?.data.content.filter((student: Student) => {
                      return search.toLocaleLowerCase() === ""
                        ? student
                        : student.name.toLocaleLowerCase().includes(search);
                    }).length
                  }{" "}
                  Result(s)
                </span>
              </div>
            </div>
          </div>

          {/* Filter by Gender */}
          <div className="mb-3 flex flex-wrap items-center gap-5">
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
              onChange={e => setSelectedGender(e.target.value)}
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
              onChange={e => setSelectedClassroom(e.target.value)}
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
            <Link
              href="/add-new-student"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary p-4 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
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
                      ? "الرقم التعريفي"
                      : "ID"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Gender"
                    : currentLanguage === "ar"
                      ? "الجنس"
                      : "Genre"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Nationality"
                    : currentLanguage === "ar"
                      ? "الجنسية"
                      : "Nationalité"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Email"
                    : currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : "E-mail"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                      ? "الهاتف المحمول"
                      : "Mobile"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Classroom"
                    : currentLanguage === "ar"
                      ? "الفصل الدراسي"
                      : currentLanguage === "fr"
                        ? "Classe"
                        : "Classe"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "View"
                    : currentLanguage === "ar"
                      ? "عرض"
                      : "Voir"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
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
                })
                .map((student: Student, index: number) => (
                  <tr
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowModal(true);
                    }}
                    className={`cursor-pointer border-b border-borderPrimary text-textPrimary ${
                      index % 2 === 0 ? "bg-bgRowTable" : "bg-bgPrimary"
                    }`}
                  >
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input
                          id={`checkbox-table-search-${student.id}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-borderPrimary bg-bgSecondary text-blue-600 focus:ring-2 focus:ring-blue-500"
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
                            src={student.picture ?? "/images/userr.png"}
                            className="mx-2 h-[25px] w-[25px] rounded-full"
                            alt="#"
                          />
                        </div>
                        <p className="text-textPrimary">
                          {String(student.name)}
                        </p>
                      </div>
                    </th>

                    <td className="whitespace-nowrap px-6 py-1">
                      {student.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {student.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {student.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {student.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {student.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {student.classroomName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
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
                    <td className="whitespace-nowrap px-6 py-1">
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
      {showModal && selectedStudent && (
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
              href={`/edit-student/${selectedStudent.id}`}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              <MdEdit />
            </a>

            {/* Content */}
            <h2 className="mb-4 text-xl font-bold">
              {currentLanguage === "ar"
                ? "معلومات الطالب"
                : currentLanguage === "fr"
                  ? "Informations de l'étudiant"
                  : "Student Information"}
            </h2>

            <div className="flex flex-col items-center gap-2">
              <img
                src={selectedStudent.picture ?? "/images/userr.png"}
                alt="student"
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="text-lg font-semibold">{selectedStudent.name}</p>
              <p className="text-sm text-gray-500">
                {currentLanguage === "ar"
                  ? "رقم الطالب"
                  : currentLanguage === "fr"
                    ? "ID étudiant"
                    : "Stu ID"}{" "}
                : {selectedStudent.id}
              </p>
            </div>

            <div className="mt-6 space-y-2 text-sm text-textSecondary">
              {[
                {
                  label:
                    currentLanguage === "ar"
                      ? "العمر"
                      : currentLanguage === "fr"
                        ? "Âge"
                        : "Age",
                  value: selectedStudent.age || "Unknown",
                },
                {
                  label:
                    currentLanguage === "ar"
                      ? "الصف"
                      : currentLanguage === "fr"
                        ? "Classe"
                        : "Class",
                  value: selectedStudent.classroomName || "Unknown",
                },
                {
                  label:
                    currentLanguage === "ar"
                      ? "الجنس"
                      : currentLanguage === "fr"
                        ? "Genre"
                        : "Gender",
                  value: selectedStudent.gender || "Unknown",
                },
                {
                  label:
                    currentLanguage === "ar"
                      ? "تاريخ الميلاد"
                      : currentLanguage === "fr"
                        ? "Date de naissance"
                        : "Date Of Birth",
                  value: selectedStudent.dateOfBirth || "Unknown",
                },
                {
                  label:
                    currentLanguage === "ar"
                      ? "الديانة"
                      : currentLanguage === "fr"
                        ? "Religion"
                        : "Religion",
                  value: selectedStudent.religion || "Unknown",
                },
                {
                  label:
                    currentLanguage === "ar"
                      ? "العنوان"
                      : currentLanguage === "fr"
                        ? "Adresse"
                        : "Address",
                  value: selectedStudent.address || "Unknown",
                },
                {
                  label:
                    currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "E-mail"
                        : "Email",
                  value: selectedStudent.email || "Unknown",
                },
                {
                  label:
                    currentLanguage === "ar"
                      ? "رقم الجوال"
                      : currentLanguage === "fr"
                        ? "Portable"
                        : "Mobile",
                  value: selectedStudent.number || "Unknown",
                },
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

            <div className="mt-6">
              <h3 className="text-md font-bold">
                {currentLanguage === "ar"
                  ? "عن الطالب"
                  : currentLanguage === "fr"
                    ? "À propos de l'étudiant"
                    : "About the student"}
              </h3>
              <p className="text-sm text-gray-700">{selectedStudent.about}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-md font-bold">
                {currentLanguage === "ar"
                  ? "شهادة"
                  : currentLanguage === "fr"
                    ? "Certification"
                    : "Certification"}
              </h3>
              <p className="text-sm text-gray-700">
                {selectedStudent.certification}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Student;
