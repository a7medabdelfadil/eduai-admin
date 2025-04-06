/* eslint-disable @next/next/no-img-element */
"use client";
import Pagination from "@/components/pagination";
import Spinner from "@/components/spinner";
import {
  useDeleteTeachersMutation,
  useGetAllTeachersQuery,
} from "@/features/User-Management/teacherApi";
import Link from "next/link";
import { useState, useEffect, SetStateAction, useRef } from "react";
import { RootState } from "@/GlobalRedux/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";
import { useUploadTeacherMutation } from "@/features/events/eventsApi";
import Modal from "@/components/model";
import { Trash2 } from "lucide-react";
import { Text } from "@/components/Text";
import { BiSearchAlt } from "react-icons/bi";
import { HiDownload } from "react-icons/hi";
import { MdEdit } from "react-icons/md";

const Teacher = () => {
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
      nameEn: "Teacher",
      nameAr: "معلم",
      nameFr: "Enseignant",
      href: "/teacher",
    },
  ];
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  console.log("👾 ~ Teacher ~ selectedTeacher:", selectedTeacher);
  const [showModal, setShowModal] = useState(false);

  const booleanValue = useSelector((state: RootState) => state.boolean.value);

  type Teacher = Record<string, any>;
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllTeachersQuery({
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

  const [deleteTeachers] = useDeleteTeachersMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTeachers({
        id: id,
        lock: "true",
      }).unwrap();
      toast.success(`Teacher with ID ${id} Locked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to lock the Teacher");
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
        page: params.page?.toString() || "",
        archived: params.archived?.toString() || "",
        graduated: params.graduated?.toString() || "",
        "search-word": params.searchWord || "",
        genders: params.genders?.join(",") || "",
        "classroom-names": params.classroomNames?.join(",") || "",
        address: params.address || "",
      });

      const response = await fetch(
        `${baseUrl}/api/v1/export/teacher/excel?${queryParams}`,
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
      a.download = "teachers.xlsx";
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

  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadEvent, { isLoading: isUploading }] = useUploadTeacherMutation();
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
              ? "جميع المعلمين"
              : currentLanguage === "fr"
                ? "Tous les enseignants"
                : "All Teacher"}
          </Text>
          <div className="flex gap-4">
            <button
              onClick={handleOpenModal}
              className="mx-3 mb-5 flex w-[190px] justify-center whitespace-nowrap rounded-xl border border-primary bg-bgPrimary px-4 py-2 text-[18px] font-semibold text-primary duration-300 ease-in hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة"
                : currentLanguage === "fr"
                  ? "ajouter"
                  : "Upload"}
              <svg
                className="h-5 w-5"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <line x1="12" y1="5" x2="12" y2="19" />{" "}
                <line x1="16" y1="9" x2="12" y2="5" />{" "}
                <line x1="8" y1="9" x2="12" y2="5" />
              </svg>
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
        <div className="flex items-center justify-between rounded-t-xl bg-bgPrimary p-4 text-center max-[502px]:grid max-[502px]:justify-center">
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
                    data?.data.content.filter((teacher: Teacher) => {
                      return search.toLocaleLowerCase() === ""
                        ? teacher
                        : teacher.name.toLocaleLowerCase().includes(search);
                    }).length
                  }{" "}
                  Result(s)
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/add-new-teacher"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary p-4 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ Add new Teacher"
                : currentLanguage === "ar"
                  ? "+ إضافة معلم جديد"
                  : currentLanguage === "fr"
                    ? "+ Ajouter un nouvel enseignant"
                    : "+ Add new Teacher"}
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
                      ? "رقم"
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
                      : "Email"}
                </th>
                <th scope="col" className="whitespace-nowrap px-6 py-1">
                  {currentLanguage === "en"
                    ? "Mobile"
                    : currentLanguage === "ar"
                      ? "الجوال"
                      : "Mobile"}
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
                .filter((teacher: Teacher) => {
                  return search.toLocaleLowerCase() === ""
                    ? teacher
                    : teacher.name.toLocaleLowerCase().includes(search);
                })
                .map((teacher: Teacher, index: number) => (
                  <tr
                    key={teacher.id}
                    onClick={() => {
                      setSelectedTeacher(teacher);
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
                            src={teacher.picture ?? "/images/userr.png"}
                            className="mx-2 h-[25px] w-[25px] rounded-full"
                            alt="#"
                          />
                        </div>
                        <p className="text-textPrimary">
                          {String(teacher.name)}
                        </p>
                      </div>
                    </th>
                    <td className="whitespace-nowrap px-6 py-1">
                      {teacher.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {teacher.gender}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {teacher.nationality}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {teacher.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      {teacher.number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-1">
                      <Link
                        href={`/teacher/view-teacher/${teacher.id}`}
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
                        onClick={() => handleDelete(teacher.id)}
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
              There is No Data
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
      {showModal && selectedTeacher && (
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
              href={`/edit-teacher/${selectedTeacher.id}`}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              <MdEdit />
            </a>

            {/* Header */}
            <h2 className="mb-4 text-xl font-bold">
              {currentLanguage === "ar"
                ? "معلومات المعلم"
                : currentLanguage === "fr"
                  ? "Informations de l'enseignant"
                  : "Teacher Information"}
            </h2>

            {/* Profile */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={selectedTeacher.picture ?? "/images/userr.png"}
                alt="teacher"
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="text-lg font-semibold">{selectedTeacher.name}</p>
              <p className="text-sm text-gray-500">{selectedTeacher.id}</p>
            </div>

            {/* Basic Details */}
            <div className="mt-6 space-y-2 text-sm text-textSecondary">
              {[
                {
                  label: "Age",
                  value: getAgeFromBirthDate(selectedTeacher.birthDate),
                },
                { label: "Gender", value: selectedTeacher.gender ?? "N/A" },
                {
                  label: "Subject",
                  value: selectedTeacher.subjects?.[0] ?? "N/A",
                },
                { label: "N. of class", value: "4" }, // Hardcoded unless dynamic
                {
                  label: "Date Of Birth",
                  value: formatDate(selectedTeacher.birthDate),
                },
                { label: "Religion", value: selectedTeacher.religion ?? "N/A" },
                {
                  label: "Address",
                  value: selectedTeacher.address ?? "13,street, Zamalk,Cairo",
                },
                { label: "Email", value: selectedTeacher.email },
                { label: "Mobile", value: selectedTeacher.number },
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

export default Teacher;
