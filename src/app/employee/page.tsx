/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect, SetStateAction, useRef } from "react";
import {
  useDeleteEmployeesMutation,
  useGetAllEmployeesQuery,
} from "@/features/User-Management/employeeApi";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";
import { useUploadEmployeeMutation } from "@/features/events/eventsApi";
import { Trash2 } from "lucide-react";
import Modal from "@/components/model";
import { HiDownload, HiUpload } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import SeeMoreButton from "@/components/SeeMoreButton";
import { Skeleton } from "@/components/Skeleton";

const Employee = () => {
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
      nameEn: "Employee",
      nameAr: "موظف",
      nameFr: "Employé",
      href: "/employee",
    },
  ];

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Employee = Record<string, any>;
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, error, isLoading, refetch } = useGetAllEmployeesQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });

  const [deleteEmployees] = useDeleteEmployeesMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteEmployees({
        id: id,
        lock: "true",
      }).unwrap();
      toast.success(`Employee with ID ${id} Locked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to lock the Employee");
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
        type: "EMPLOYEE",
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
      a.download = "employees.xlsx";
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

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadEvent, { isLoading: isUploading }] = useUploadEmployeeMutation();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetNumber, setSheetNumber] = useState("");

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate progress
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
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setFile(null);
    setProgress(0);
    setSheetNumber("");
  };

  const handleUploadEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sheetNumber", sheetNumber);

    try {
      await uploadEvent(formData).unwrap();
      toast.success("Event uploaded successfully");
      handleCloseModal();
      void refetch();
    } catch (err: any) {
      toast.error(`${err?.data?.message}`);
    }
  };
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

  const [visibleCount, setVisibleCount] = useState(20);
  const filteredData =
    data?.data?.content?.filter((employee: Employee) =>
      search.trim() === ""
        ? true
        : employee.name?.toLowerCase().includes(search.trim().toLowerCase()),
    ) || [];
  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="items-between flex flex-col justify-start md:flex-row md:items-center md:justify-between">
          <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">
              {currentLanguage === "ar"
                ? "جميع الموظفين"
                : currentLanguage === "fr"
                  ? "Tous les employés"
                  : "All Employees"}
              {/* default */}
            </h1>
          </div>
          <div className="flex items-center justify-between self-end">
            <div className="flex flex-col gap-4 md:flex-row">
              <button
                onClick={handleOpenModal}
                className="mx-3 mb-5 flex w-[190px] justify-center whitespace-nowrap rounded-xl border border-primary bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in hover:shadow-xl"
              >
                {currentLanguage === "ar"
                  ? "إضافة"
                  : currentLanguage === "fr"
                    ? "ajouter"
                    : "Upload"}
                <HiUpload
                  className={`${currentLanguage == "ar" ? "mr-2" : "ml-2"} mt-1`}
                />
              </button>
              <button
                onClick={() =>
                  handleExport({
                    size: rowsPerPage,
                    page: currentPage,
                    archived: false,
                    graduated: false,
                  })
                }
                className="mx-3 mb-5 flex w-[190px] justify-center whitespace-nowrap rounded-xl border border-primary bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in hover:shadow-xl"
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
                    ? "تحميل"
                    : currentLanguage === "fr"
                      ? "Télécharger"
                      : "Download"}
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
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
                    className="border-borderSecondary block w-full rounded-lg border-2 bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-borderPrimary"
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
                      data?.data.content.filter((employee: Employee) => {
                        return search.toLocaleLowerCase() === ""
                          ? employee
                          : employee.name.toLocaleLowerCase().includes(search);
                      }).length
                    }{" "}
                    Result(s)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Link
                href="/add-new-employee"
                className="mx-3 mb-5 w-fit self-end whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
              >
                {currentLanguage === "en"
                  ? "+ New Employee"
                  : currentLanguage === "ar"
                    ? "+ موظف جديد"
                    : "+ Nouvel Employé"}
              </Link>
            </div>
          </div>
          <div className="relative -mt-4 overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الاسم الكامل"
                      : currentLanguage === "fr"
                        ? "Nom complet"
                        : "Full Name"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar" ? "الرقم" : "ID"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الجنس"
                      : currentLanguage === "fr"
                        ? "Genre"
                        : "Gender"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الجنسية"
                      : currentLanguage === "fr"
                        ? "Nationalité"
                        : "Nationality"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "البريد الإلكتروني"
                      : currentLanguage === "fr"
                        ? "Courriel"
                        : "Email"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الهاتف المحمول"
                      : currentLanguage === "fr"
                        ? "Téléphone"
                        : "Mobile"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "عرض"
                      : currentLanguage === "fr"
                        ? "Voir"
                        : "View"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "الإجراء"
                      : currentLanguage === "fr"
                        ? "Action"
                        : "Action"}
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !visibleData || visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-6 text-center font-medium"
                    >
                      {currentLanguage === "ar"
                        ? "لا توجد بيانات"
                        : currentLanguage === "fr"
                          ? "Aucune donnée disponible"
                          : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData
                    .filter((employee: Employee) =>
                      search.trim() === ""
                        ? true
                        : employee.name
                            ?.toLowerCase()
                            .includes(search.trim().toLowerCase()),
                    )
                    .map((employee: Employee, index: number) => (
                      <TableRow
                        className="cursor-pointer"
                        data-index={index}
                        key={employee.id}
                        onClick={e => {
                          if ((e.target as HTMLElement).closest("a")) return;
                          setSelectedEmployee(employee);
                          setShowModal(true);
                        }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-[50px]">
                              <img
                                src={employee.picture ?? "/images/userr.png"}
                                className="mx-2 h-[25px] w-[25px] rounded-full"
                                alt="#"
                              />
                            </div>
                            <p className="text-textPrimary">
                              {String(employee.name)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{employee.id}</TableCell>
                        <TableCell>{employee.gender}</TableCell>
                        <TableCell>{employee.nationality}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.number || "-"} </TableCell>
                        <TableCell>
                          <Link
                            href={`/employee/view-employee/${employee.id}`}
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {currentLanguage === "en"
                              ? "View"
                              : currentLanguage === "ar"
                                ? "عرض"
                                : "Voir"}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            disabled={employee.role === "Admin"}
                            className={`rounded-lg px-2 py-1 font-semibold text-white shadow-lg delay-150 duration-300 ease-in-out ${
                              employee.role === "Admin"
                                ? "cursor-not-allowed bg-red-800"
                                : "bg-error hover:-translate-y-1 hover:scale-110"
                            }`}
                          >
                            {currentLanguage === "en"
                              ? "Lock"
                              : currentLanguage === "ar"
                                ? "قفل"
                                : "Verrouiller"}
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            {visibleCount < filteredData.length && (
              <SeeMoreButton
                onClick={() => setVisibleCount(prev => prev + 20)}
              />
            )}
          </div>
        </div>
      </Container>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h1 className="text-lg font-semibold">Upload File</h1>
        <p className="mb-4 font-light text-secondary">
          Please upload files in Excel format and make sure the file size is
          under 25 MB.
        </p>
        <form onSubmit={handleUploadEvent} className="space-y-4">
          <div
            className="rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 p-6"
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
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
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
            className="w-full rounded-lg border border-borderPrimary p-2"
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
      {showModal && selectedEmployee && (
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
              href={`/edit-employee/${selectedEmployee.id}`}
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
                src={selectedEmployee.picture ?? "/images/userr.png"}
                alt="admin"
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="text-lg font-semibold">{selectedEmployee.name}</p>
              <p className="text-sm text-gray-500">{selectedEmployee.id}</p>
            </div>

            {/* Basic Details */}
            <div className="mt-6 space-y-2 text-sm text-textSecondary">
              {[
                {
                  label: "Age",
                  value: getAgeFromBirthDate(selectedEmployee.birthDate),
                },
                { label: "Gender", value: selectedEmployee.gender ?? "N/A" },
                {
                  label: "Nationality",
                  value: selectedEmployee.nationality ?? "N/A",
                },
                {
                  label: "Religion",
                  value: selectedEmployee.religion ?? "N/A",
                },
                {
                  label: "Date Of Birth",
                  value: formatDate(selectedEmployee.birthDate),
                },
                { label: "Email", value: selectedEmployee.email },
                { label: "Mobile", value: selectedEmployee.phoneNumber },
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

export default Employee;
