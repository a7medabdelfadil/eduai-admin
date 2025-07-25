/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  useDeleteStudentsMutation,
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
} from "@/features/User-Management/studentApi";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";
import { BiSearchAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import { Text } from "@/components/Text";
import { HiDownload, HiUpload } from "react-icons/hi";
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
import { useUploadStudentsMutation } from "@/features/events/eventsApi";
import { Trash2 } from "lucide-react";
import Modal from "@/components/model";

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
      href: "/user-management/student",
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

  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [sheetNumber, setSheetNumber] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadStudents, { isLoading: isUploading }] = useUploadStudentsMutation();


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

  const handleUploadStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheetNumber", sheetNumber);

    try {
      await uploadStudents(formData).unwrap();
      toast.success("Students uploaded successfully");
      handleCloseModal();
      void refetch();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreviewUrl(URL.createObjectURL(selectedFile));
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setFilePreviewUrl(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFile(null);
    setFilePreviewUrl(null);
    setProgress(0);
    setSheetNumber("");
  };


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
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
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
    {
      key: "Full Name",
      en: "Full Name",
      ar: "الاسم الكامل",
      fr: "Nom complet",
    },
    { key: "ID", en: "ID", ar: "الرقم التعريفي", fr: "ID" },
    { key: "Gender", en: "Gender", ar: "الجنس", fr: "Genre" },
    { key: "Nationality", en: "Nationality", ar: "الجنسية", fr: "Nationalité" },
    { key: "Email", en: "Email", ar: "البريد الإلكتروني", fr: "E-mail" },
    { key: "Mobile", en: "Mobile", ar: "الهاتف المحمول", fr: "Mobile" },
    { key: "Classroom", en: "Classroom", ar: "الفصل الدراسي", fr: "Classe" },
    { key: "View", en: "View", ar: "عرض", fr: "Voir" },
    { key: "Action", en: "Action", ar: "الإجراء", fr: "Action" },
    { key: "Lock", en: "Lock", ar: "قفل", fr: "Verrouiller" },
    {
      key: "No data available",
      en: "No data available",
      ar: "لا توجد بيانات",
      fr: "Aucune donnée",
    },
  ];

  const t = (en: string, ar: string, fr: string) => {
    return currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;
  };

  const [visibleCount, setVisibleCount] = useState(20);
  const handleShowMore = () => setVisibleCount(prev => prev + 20);
  const filteredData = data?.data.content?.filter((student: any) =>
    search.trim() === ""
      ? true
      : student.name?.toLowerCase().includes(search.toLowerCase()),
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
        <div className="-mt-6 flex items-center justify-between">
          <Text font="bold" size="3xl">
            {currentLanguage === "ar"
              ? "جميع الطلاب"
              : currentLanguage === "fr"
                ? "Tous les étudiants"
                : "All Students"}
          </Text>
        </div>
        <div className="flex items-center justify-between">
          <div className="mx-10 flex gap-5">
            <Link href="/user-management/student" className="text-primary underline">
              {currentLanguage === "ar"
                ? "طالب نشط"
                : currentLanguage === "fr"
                  ? "Étudiant actif"
                  : "Active Student"}
            </Link>
            <Link
              className="hover:text-blue-500 hover:underline"
              href="/user-management/student/graduated"
            >
              {currentLanguage === "ar"
                ? "طالب خريج"
                : currentLanguage === "fr"
                  ? "Étudiant diplômé"
                  : "Graduate Student"}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="mx-3 flex w-fit justify-center whitespace-nowrap rounded-xl border border-primary bg-bgPrimary p-4 text-sm text-primary duration-300 ease-in hover:shadow-xl"
            >
              <HiUpload
                size={20}
                className={`${currentLanguage == "ar" ? "ml-2" : "mr-2"}`}
              />
              {currentLanguage === "ar"
                ? "رفع ملف"
                : currentLanguage === "fr"
                  ? "Téléverser un fichier"
                  : "Upload File"}
            </button>

            <button
              onClick={() =>
                handleExport({
                  size: 1000000,
                  page: 0,
                  archived: false,
                  graduated: false,
                })
              }
              className="flex w-fit justify-center whitespace-nowrap rounded-xl border border-primary bg-bgPrimary p-4 text-sm text-primary duration-300 ease-in hover:shadow-xl"
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
        </div>
      </Container>

      <Container>
        {/* SEARCH + FILTERS + NEW STUDENT BUTTON */}
        <div className="-mt-4 flex flex-wrap items-center justify-between gap-4 rounded-t-xl bg-bgPrimary p-4 text-center">
          {/* Search Box */}
          <div className="flex min-w-72 items-center gap-4 md:min-w-80">
            <label htmlFor="searchInput" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <input
                onChange={e => setSearch(e.target.value)}
                type="text"
                id="searchInput"
                name="search"
                className="border-borderSecondary block w-full rounded-lg border-2 bg-bgPrimary py-2 pe-4 ps-11 text-lg outline-none dark:border-borderPrimary"
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
              <label
                htmlFor="genderFilter"
                className="text-sm font-semibold text-gray-700"
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
                className="w-40 rounded-md border border-borderPrimary bg-bgPrimary px-2 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
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
            </div>

            {/* Classroom Filter */}
            <div className="flex flex-col text-start">
              <label
                htmlFor="classroomFilter"
                className="text-sm font-semibold text-gray-700"
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
                onChange={e => {
                  setSelectedClassroom(e.target.value);
                  void refetch();
                }}
                className="w-40 rounded-md border border-borderPrimary bg-bgPrimary px-2 py-2 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
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
          </div>

          {/* New Student Button */}
          <div className="flex justify-center">
            <Link
              href="/user-management/student/add-new-student"
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

        <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t("Full Name", "الاسم الكامل", "Nom complet")}
                </TableHead>
                <TableHead>{t("ID", "الرقم التعريفي", "ID")}</TableHead>
                <TableHead>{t("Gender", "الجنس", "Genre")}</TableHead>
                <TableHead>
                  {t("Nationality", "الجنسية", "Nationalité")}
                </TableHead>
                <TableHead>
                  {t("Email", "البريد الإلكتروني", "E-mail")}
                </TableHead>
                <TableHead>
                  {t("Classroom", "الفصل الدراسي", "Classe")}
                </TableHead>
                <TableHead>{t("View", "عرض", "Voir")}</TableHead>
                <TableHead>{t("Action", "الإجراء", "Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    {Array(9)
                      .fill(0)
                      .map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : filteredData?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-6 text-center text-gray-500"
                  >
                    {t("No data available", "لا توجد بيانات", "Aucune donnée")}
                  </TableCell>
                </TableRow>
              ) : (
                displayedData.map((student: Student, index: number) => (
                  <TableRow
                    data-index={index}
                    key={student.id}
                    onClick={e => {
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
                    <TableCell>{student.classroomName}</TableCell>
                    <TableCell>
                      <Link
                        href={`/user-management/student/view-student/${student.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {t("View", "عرض", "Voir")}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="rounded bg-error px-2 py-1 text-sm text-white hover:scale-105"
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
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1 className="text-lg font-semibold">Upload File</h1>
        <p className="mb-4 font-light text-secondary">
          Please upload files in Excel format and make sure the file size is
          under 25 MB.
        </p>
        <form onSubmit={handleUploadStudent} className="space-y-4">
          <div
            className="rounded-lg border-2 border-dashed border-borderPrimary bg-bgPrimary p-6"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="text-center">
                <div className="mb-4">Drop file or Browse</div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e =>
                    e.target.files && handleFile(e.target.files[0])
                  }
                  className="hidden"
                  accept=".xlsx,.xls"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-hover"
                >
                  Browse
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-purple-600">
                      <svg
                        className="h-8 w-8"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-gray-500">
                        Format: {file.type || "Excel"} file size:{" "}
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleDeleteFile}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-end">
                  {filePreviewUrl && (
                    <a
                      href={filePreviewUrl}
                      download={file.name}
                      className="text-blue-600 hover:underline text-sm text-end"
                    >
                      Download
                    </a>
                  )}
                </div>
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-bgSecondary">
                  <div
                    className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-sm text-gray-500">
                  {progress}%
                </div>
              </div>
            )}
          </div>
          <input
            placeholder="Sheet Number"
            type="number"
            value={sheetNumber}
            onChange={e => setSheetNumber(e.target.value)}
            className="w-full rounded-lg bg-bgPrimary border border-borderPrimary p-2"
            required
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-2 text-white hover:bg-hover"
            disabled={!file}
          >
            {isUploading ? "uploading..." : "Upload"}
          </button>
        </form>
      </Modal>
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
              href={`/user-management/student/edit-student/${selectedStudent.id}`}
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
