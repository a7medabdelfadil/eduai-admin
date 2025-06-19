/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useGetAllDriversQuery,
  useDeleteDriversMutation,
} from "@/features/User-Management/driverApi";
import Link from "next/link";
import { useState, useEffect, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";

const ArchiveDriver = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Archive",
      nameAr: "الأرشيف",
      nameFr: "Archives",
      href: "/archive",
    },
    {
      nameEn: "Driver",
      nameAr: "السائق",
      nameFr: "Chauffeur",
      href: "/archive/driver",
    },
  ];

  type Driver = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllDriversQuery({
    archived: "true",
    page: 0,
    size: 1000000,
  });

  const [deleteDrivers] = useDeleteDriversMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteDrivers({
        id: id,
        lock: "false",
      }).unwrap();
      toast.success(`Driver with ID ${id} unLocked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to unlock the Driver");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const translate = {
    name:
      currentLanguage === "ar"
        ? "الاسم"
        : currentLanguage === "fr"
          ? "Nom"
          : "Name",
    gender:
      currentLanguage === "ar"
        ? "الجنس"
        : currentLanguage === "fr"
          ? "Genre"
          : "Gender",
    nationality:
      currentLanguage === "ar"
        ? "الجنسية"
        : currentLanguage === "fr"
          ? "Nationalité"
          : "Nationality",
    email:
      currentLanguage === "ar"
        ? "البريد الإلكتروني"
        : currentLanguage === "fr"
          ? "Courriel"
          : "Email",
    mobile:
      currentLanguage === "ar"
        ? "الجوال"
        : currentLanguage === "fr"
          ? "Mobile"
          : "Mobile",
    view:
      currentLanguage === "ar"
        ? "عرض"
        : currentLanguage === "fr"
          ? "Voir"
          : "View",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    unlock:
      currentLanguage === "ar"
        ? "إلغاء القفل"
        : currentLanguage === "fr"
          ? "Déverrouiller"
          : "Unlock",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };
  const filteredData = data?.data?.content?.filter((driver: Driver) =>
    driver.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />

      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "All Drivers"
              : currentLanguage === "ar"
                ? "جميع السائقين"
                : currentLanguage === "fr"
                  ? "Tous les conducteurs"
                  : "All Drivers"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col gap-4 rounded-lg px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="relative w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={
                    currentLanguage === "en"
                      ? "Search"
                      : currentLanguage === "ar"
                        ? "بحث"
                        : "Recherche"
                  }
                />
                <span className="whitespace-nowrap text-sm text-primary">
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/add-new-driver"
              className="w-fit self-end whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[16px] font-semibold text-white transition hover:bg-hover hover:shadow-md"
            >
              {currentLanguage === "ar"
                ? "+ سائق جديد"
                : currentLanguage === "fr"
                  ? "+ Nouveau Chauffeur"
                  : "+ New Driver"}
            </Link>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-l">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>{translate.gender}</TableHead>
                  <TableHead>{translate.nationality}</TableHead>
                  <TableHead>{translate.email}</TableHead>
                  <TableHead>{translate.mobile}</TableHead>
                  <TableHead>{translate.view}</TableHead>
                  <TableHead>{translate.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filteredData?.length ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((driver: Driver, index: number) => (
                    <TableRow key={driver.id} data-index={index}>
                      <TableCell>
                        <input type="checkbox" className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={driver.picture || "/images/userr.png"}
                            className="h-9 w-9 rounded-full border object-cover"
                            alt={driver.name || "driver"}
                          />
                          <span>{driver.name}</span>
                        </div>
                      </TableCell>

                      <TableCell>{driver.id}</TableCell>
                      <TableCell>{driver.gender}</TableCell>
                      <TableCell>{driver.nationality}</TableCell>
                      <TableCell>{driver.email}</TableCell>
                      <TableCell>{driver.number}</TableCell>
                      <TableCell>
                        <Link
                          href={`/driver/view-driver/${driver.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {translate.view}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelete(driver.id)}
                          className="text-error transition hover:text-red-800"
                          title={translate.unlock}
                        >
                          <BiTrash size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {visibleCount < (filteredData?.length || 0) && (
              <SeeMoreButton
                onClick={() => setVisibleCount(prev => prev + 20)}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default ArchiveDriver;
