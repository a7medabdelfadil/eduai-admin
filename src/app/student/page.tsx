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
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";

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

  type Student = Record<string, any>;
  const [search, setSearch] = useState("");

  // New states to hold selected values of gender & classroom
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");

  // Fetching data
  const { data, error, isLoading, refetch } = useGetAllStudentsQuery({
    archived: "false",
    page: 0,
    size: 1000000,
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

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );


  const translations = [
    { key: "Full Name", en: "Full Name", ar: "الاسم الكامل", fr: "Nom complet" },
    { key: "ID", en: "ID", ar: "الرقم التعريفي", fr: "ID" },
    { key: "Gender", en: "Gender", ar: "الجنس", fr: "Genre" },
    { key: "Nationality", en: "Nationality", ar: "الجنسية", fr: "Nationalité" },
    { key: "Email", en: "Email", ar: "البريد الإلكتروني", fr: "E-mail" },
    { key: "Mobile", en: "Mobile", ar: "الهاتف المحمول", fr: "Mobile" },
    { key: "Classroom", en: "Classroom", ar: "الفصل الدراسي", fr: "Classe" },
    { key: "View", en: "View", ar: "عرض", fr: "Voir" },
    { key: "Action", en: "Action", ar: "الإجراء", fr: "Action" },
    { key: "Lock", en: "Lock", ar: "قفل", fr: "Verrouiller" },
    { key: "No data available", en: "No data available", ar: "لا توجد بيانات", fr: "Aucune donnée" },
  ];

  const t = (en: string, ar: string, fr: string) => {
    return currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;
  };

  const [visibleCount, setVisibleCount] = useState(20);
  const handleShowMore = () => setVisibleCount(prev => prev + 20);
  const filteredData = data?.data.content?.filter((student: any) =>
    search.trim() === "" ? true : student.name?.toLowerCase().includes(search.toLowerCase())
  );

  const displayedData = filteredData?.slice(0, visibleCount);


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
      <Container>
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
                size: 0,
                page: 1000000,
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
          <Link className="hover:text-blue-500 hover:underline" href="/student/graduated">
            {currentLanguage === "ar"
              ? "طالب خريج"
              : currentLanguage === "fr"
                ? "Étudiant diplômé"
                : "Graduate Student"}
          </Link>
        </div>
      </Container>

      <Container>
        {/* SEARCH + FILTERS + NEW STUDENT BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-t-xl bg-bgPrimary p-4 text-center">
          {/* Search Box */}
          <div className="min-w-72 flex items-center gap-4 md:min-w-80">
            <label htmlFor="searchInput" className="sr-only">Search</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                id="searchInput"
                name="search"
                className="block w-full rounded-lg bg-bgPrimary border-2 border-borderSecondary ps-11 pe-4 py-2 text-lg outline-none dark:border-borderPrimary"
                placeholder={
                  currentLanguage === "ar"
                    ? "ابحث عن أي شيء"
                    : currentLanguage === "fr"
                      ? "Rechercher n'importe quoi"
                      : "Search anything"
                }
              />
            </div>
            <span className="mt-1 inline-block text-primary">
              {filteredData?.length}{" "}
              {currentLanguage === "ar"
                ? "نتيجة"
                : currentLanguage === "fr"
                  ? "résultat(s)"
                  : "Result(s)"}
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Gender Filter */}
            <div className="flex flex-col text-start">
              <label htmlFor="genderFilter" className="text-sm font-semibold text-gray-700">
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
                className="w-40 rounded-md border bg-bgPrimary border-borderPrimary px-2 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">{currentLanguage === "en" ? "All" : currentLanguage === "ar" ? "الكل" : "Tous"}</option>
                <option value="male">{currentLanguage === "en" ? "Male" : currentLanguage === "ar" ? "ذكر" : "Masculin"}</option>
                <option value="female">{currentLanguage === "en" ? "Female" : currentLanguage === "ar" ? "أنثى" : "Féminin"}</option>
              </select>
            </div>

            {/* Classroom Filter */}
            <div className="flex flex-col text-start">
              <label htmlFor="classroomFilter" className="text-sm font-semibold text-gray-700">
                {currentLanguage === "en" ? "Classroom" : currentLanguage === "ar" ? "الفصل الدراسي" : "Classe"}
              </label>
              <select
                id="classroomFilter"
                value={selectedClassroom}
                onChange={e => setSelectedClassroom(e.target.value)}
                className="w-40 rounded-md border bg-bgPrimary border-borderPrimary px-2 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">{currentLanguage === "en" ? "All" : currentLanguage === "ar" ? "الكل" : "Tous"}</option>
                {uniqueClassrooms.map((classroom: any) => (
                  <option key={classroom} value={classroom}>{classroom}</option>
                ))}
              </select>
            </div>
          </div>

          {/* New Student Button */}
          <div className="flex justify-center">
            <Link
              href="/add-new-student"
              className="mx-3 rounded-xl bg-primary p-3 text-base font-semibold text-white transition-all duration-300 hover:bg-hover hover:shadow-xl"
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

        <div className="relative overflow-auto shadow-md sm:rounded-lg bg-bgPrimary">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Full Name", "الاسم الكامل", "Nom complet")}</TableHead>
                <TableHead>{t("ID", "الرقم التعريفي", "ID")}</TableHead>
                <TableHead>{t("Gender", "الجنس", "Genre")}</TableHead>
                <TableHead>{t("Nationality", "الجنسية", "Nationalité")}</TableHead>
                <TableHead>{t("Email", "البريد الإلكتروني", "E-mail")}</TableHead>
                <TableHead>{t("Mobile", "الهاتف المحمول", "Mobile")}</TableHead>
                <TableHead>{t("Classroom", "الفصل الدراسي", "Classe")}</TableHead>
                <TableHead>{t("View", "عرض", "Voir")}</TableHead>
                <TableHead>{t("Action", "الإجراء", "Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    {Array(9).fill(0).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                    {t("No data available", "لا توجد بيانات", "Aucune donnée")}
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((student: Student, index: number) => (
                  <TableRow
                    data-index={index}
                    key={student.id}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("a")) return;
                      setSelectedStudent(student);
                      setShowModal(true);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={student.picture ?? "/images/userr.png"}
                          className="h-6 w-6 rounded-full"
                          alt="#"
                        />
                        <p>{student.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.nationality}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.number}</TableCell>
                    <TableCell>{student.classroomName}</TableCell>
                    <TableCell>
                      <Link
                        href={`/student/view-student/${student.id}`}
                        className="text-primary hover:underline text-sm"
                      >
                        {t("View", "عرض", "Voir")}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="rounded bg-error px-2 py-1 text-white text-sm hover:scale-105"
                      >
                        {t("Lock", "قفل", "Verrouiller")}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {filteredData?.length > visibleCount && (
            <SeeMoreButton onClick={handleShowMore} />
          )}

        </div>
      </Container>
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
