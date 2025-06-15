/* eslint-disable @next/next/no-img-element */
"use client";
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
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";
import { BiShow, BiLock } from "react-icons/bi";

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
  const [showModal, setShowModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  type Worker = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllWorkersQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });
  const [deleteWorker, { isLoading: isDeleting }] = useDeleteWorkersMutation();

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

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );


  const translate = {
    fullName: currentLanguage === "ar" ? "الاسم الكامل" : currentLanguage === "fr" ? "Nom complet" : "Full Name",
    id: currentLanguage === "ar" ? "الرقم" : currentLanguage === "fr" ? "ID" : "ID",
    gender: currentLanguage === "ar" ? "الجنس" : currentLanguage === "fr" ? "Genre" : "Gender",
    nationality: currentLanguage === "ar" ? "الجنسية" : currentLanguage === "fr" ? "Nationalité" : "Nationality",
    email: currentLanguage === "ar" ? "البريد الإلكتروني" : currentLanguage === "fr" ? "Email" : "Email",
    mobile: currentLanguage === "ar" ? "الموبايل" : currentLanguage === "fr" ? "Mobile" : "Mobile",
    view: currentLanguage === "ar" ? "عرض" : currentLanguage === "fr" ? "Voir" : "View",
    lock: currentLanguage === "ar" ? "قفل" : currentLanguage === "fr" ? "Verrouiller" : "Lock",
    action: currentLanguage === "ar" ? "الإجراء" : currentLanguage === "fr" ? "Action" : "Action",
    noData: currentLanguage === "ar" ? "لا توجد بيانات" : currentLanguage === "fr" ? "Aucune donnée disponible" : "No data available",
  };
  const filteredData = data?.data?.content?.filter((worker: any) => {
    return search.trim() === "" || worker.name?.toLowerCase()?.includes(search.toLowerCase());
  }) || [];

  const visibleData = filteredData.slice(0, visibleCount);

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

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-mt-6 flex items-center justify-between">
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
                size: 0,
                page: 1000000,
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
                    filteredData.length
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
        <div className="relative overflow-auto shadow-md sm:rounded-lg -mt-4 bg-bgPrimary">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{translate.fullName}</TableHead>
                <TableHead>{translate.id}</TableHead>
                <TableHead>{translate.gender}</TableHead>
                <TableHead>{translate.nationality}</TableHead>
                <TableHead>{translate.email}</TableHead>
                <TableHead>{translate.mobile}</TableHead>
                <TableHead>{translate.action}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : visibleData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center font-medium">
                    {translate.noData}
                  </TableCell>
                </TableRow>
              ) : (
                visibleData.map((worker: Worker, index: number) => (
                  <TableRow
                    key={worker.id}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("a")) return;
                      setSelectedWorker(worker);
                      setShowModal(true);
                    }}
                    data-index={index}
                  >
                    <TableCell className="flex items-center gap-2">
                      <img
                        src={worker.picture ?? "/images/userr.png"}
                        className="mx-2 h-[25px] w-[25px] rounded-full"
                        alt="#"
                      />
                      <p>{worker.name}</p>
                    </TableCell>
                    <TableCell>{worker.id}</TableCell>
                    <TableCell>{worker.gender}</TableCell>
                    <TableCell>{worker.nationality}</TableCell>
                    <TableCell>{worker.email}</TableCell>
                    <TableCell>{worker.number}</TableCell>
                    <TableCell className="flex items-center gap-3">
                      <Link
                        href={`/worker/view-worker/${worker.id}`}
                        className="text-primary hover:text-primaryHover transition"
                        title={translate.view}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BiShow size={20} />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(worker.id);
                        }}
                        className="text-error hover:text-red-800 transition"
                        title={translate.lock}
                        disabled={isDeleting}
                      >
                        <BiLock size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {visibleCount < filteredData.length && (
            <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
          )}

        </div>
      </Container>
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
