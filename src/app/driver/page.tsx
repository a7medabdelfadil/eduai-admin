/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useGetAllDriversQuery,
  useDeleteDriversMutation,
} from "@/features/User-Management/driverApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import BreadCrumbs from "@/components/BreadCrumbs";
import { baseUrl } from "@/components/BaseURL";
import { Text } from "@/components/Text";
import { HiDownload } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import Container from "@/components/Container";

const Driver = () => {
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
      nameEn: "Driver",
      nameAr: "السائق",
      nameFr: "Conducteurs",
      href: "/driver",
    },
  ];

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showModal, setShowModal] = useState(false);


  type Driver = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllDriversQuery({
    archived: "false",
    page: 0,
    size: 1000000,
  });

  const [deleteDrivers] = useDeleteDriversMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteDrivers({
        id: id,
        lock: "true",
      }).unwrap();
      toast.success(`Driver with ID ${id} Locked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to delete the Driver");
    }
  };
  const filteredData = data?.data?.content?.filter((driver: Driver) =>
    search.trim() === ""
      ? true
      : driver.name?.toLowerCase()?.includes(search.trim().toLowerCase())
  );

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
        type: "DRIVER",
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
      a.download = "drivers.xlsx";
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

  const getAgeFromBirthDate = (birthDate: string | null) => {
    if (!birthDate) return "N/A";
    const birth = new Date(birthDate);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  };

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="flex items-center justify-between">
          <Text font="bold" size="3xl">
            {currentLanguage === "ar"
              ? "جميع السائقين"
              : currentLanguage === "fr"
                ? "Tous les conducteurs"
                : "All Drivers"}
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
              className={`${currentLanguage == "ar" ? "ml-2" : "mr-2"}`}
            />
            {isLoadingDownload
              ? currentLanguage === "ar"
                ? "جارٍ التنزيل..."
                : currentLanguage === "fr"
                  ? "Téléchargement..."
                  : "Downloading..."
              : currentLanguage === "ar"
                ? "تحميل جميع السائقين"
                : currentLanguage === "fr"
                  ? "Télécharger tous les conducteurs"
                  : "Download All Drivers"}
          </button>
        </div>
        <div className="max-[502px] :justify-center flex justify-between rounded-t-xl bg-bgPrimary p-4 text-center max-[502px]:grid">
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
                   filteredData.length
                  }{" "}
                  {currentLanguage === "ar" ? "نتيجة" : currentLanguage === "fr" ? "résultat(s)" : "Result(s)"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/add-new-driver"
              className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ New Driver"
                : currentLanguage === "ar"
                  ? "+ سائق جديد"
                  : currentLanguage === "fr"
                    ? "+ Nouveau Chauffeur"
                    : "+ New Driver"}{" "}
              {/* Default to English */}
            </Link>
          </div>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{currentLanguage === "ar" ? "الاسم" : currentLanguage === "fr" ? "Nom" : "Name"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الرقم" : currentLanguage === "fr" ? "ID" : "ID"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الجنس" : currentLanguage === "fr" ? "Genre" : "Gender"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الجنسية" : currentLanguage === "fr" ? "Nationalité" : "Nationality"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "البريد الإلكتروني" : currentLanguage === "fr" ? "Courriel" : "Email"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الجوال" : currentLanguage === "fr" ? "Mobile" : "Mobile"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "إجراء" : currentLanguage === "fr" ? "Action" : "Action"}</TableHead>
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
              ) : !filteredData || filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center font-medium">
                    {currentLanguage === "ar"
                      ? "لا توجد بيانات"
                      : currentLanguage === "fr"
                        ? "Aucune donnée"
                        : "No data available"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((driver: Driver, index: number) => (
                  <TableRow key={driver.id} data-index={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img
                          src={driver.picture ?? "/images/userr.png"}
                          className="h-7 w-7 rounded-full"
                          alt="avatar"
                        />
                        <p>{driver.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>{driver.id}</TableCell>
                    <TableCell>{driver.gender}</TableCell>
                    <TableCell>{driver.nationality}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.number}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Link
                        href={`/driver/view-driver/${driver.id}`}
                        className="text-primary hover:underline"
                        title="View"
                      >
                        {currentLanguage === "ar" ? "عرض" : currentLanguage === "fr" ? "Voir" : "View"}
                      </Link>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="rounded-lg bg-error px-2 py-1 font-semibold text-white shadow-lg hover:scale-105"
                      >
                        {currentLanguage === "ar" ? "قفل" : currentLanguage === "fr" ? "Verrouiller" : "Lock"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

        </div>
      </Container>
      {showModal && selectedDriver && (
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
              href={`/edit-driver/${selectedDriver.id}`}
              className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              <MdEdit />
            </a>

            {/* Header */}
            <h2 className="mb-4 text-xl font-bold">
              {currentLanguage === "ar"
                ? "معلومات السائق"
                : currentLanguage === "fr"
                  ? "Informations du conducteur"
                  : "Driver Information"}
            </h2>

            {/* Profile */}
            <div className="flex flex-col items-center gap-2">
              <img
                src={selectedDriver.picture ?? "/images/userr.png"}
                alt="driver"
                className="h-24 w-24 rounded-full object-cover"
              />
              <p className="text-lg font-semibold">{selectedDriver.name}</p>
              <p className="text-sm text-gray-500">{selectedDriver.id}</p>
            </div>

            {/* Basic Details */}
            <div className="mt-6 space-y-2 text-sm text-textSecondary">
              {[
                {
                  label: "Age",
                  value: getAgeFromBirthDate(selectedDriver.birthDate),
                },
                { label: "Gender", value: selectedDriver.gender ?? "N/A" },
                { label: "Religion", value: selectedDriver.religion ?? "N/A" },
                { label: "Mobile", value: selectedDriver.phoneNumber },
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

export default Driver;
