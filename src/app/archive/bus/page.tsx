"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import {
  useGetAllBussQuery,
  useDeleteBussMutation,
} from "@/features/Infrastructure/busApi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import { BiTrash, BiEditAlt, BiSearchAlt } from "react-icons/bi";

const Bus = () => {
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
      nameEn: "Bus",
      nameAr: "المكتبة",
      nameFr: "Autobus",
      href: "/archive/bus",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const translate = {
    busNumber: currentLanguage === "ar" ? "رقم الحافلة" : currentLanguage === "fr" ? "Numéro de bus" : "Bus Number",
    capacity: currentLanguage === "ar" ? "سعة الحافلة" : currentLanguage === "fr" ? "Capacité du bus" : "Bus Capacity",
    schoolId: currentLanguage === "ar" ? "رقم المدرسة" : currentLanguage === "fr" ? "ID de l'école" : "School ID",
    createdAt: currentLanguage === "ar" ? "تاريخ الإنشاء" : currentLanguage === "fr" ? "Date de création" : "Created At",
    updatedAt: currentLanguage === "ar" ? "تاريخ التحديث" : currentLanguage === "fr" ? "Date de mise à jour" : "Updated At",
    action: currentLanguage === "ar" ? "الإجراء" : currentLanguage === "fr" ? "Action" : "Action",
    edit: currentLanguage === "ar" ? "تعديل" : currentLanguage === "fr" ? "Modifier" : "Edit",
    delete: currentLanguage === "ar" ? "حذف" : currentLanguage === "fr" ? "Supprimer" : "Delete",
    noData: currentLanguage === "ar" ? "لا توجد بيانات" : currentLanguage === "fr" ? "Aucune donnée disponible" : "No data available",
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن حافلة"
        : currentLanguage === "fr"
          ? "Rechercher un bus"
          : "Search bus",

    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };

  const { data, error, isLoading, refetch } = useGetAllBussQuery("0");
  const [search, setSearch] = useState("");

  const [deleteBuses] = useDeleteBussMutation();
  type Bus = Record<string, any>;

  const handleDelete = async (id: number) => {

    try {
      await deleteBuses(id).unwrap();

      toast.success(`Bus with ID ${id} Deleted successfully`);
      void refetch();
    } catch {
      toast.error("Failed to Delete the Bus");
    }
  };

  const formatTransactionDate = (dateString: string | number | Date) => {
    if (!dateString) return "No transaction date";
    const formatter = new Intl.DateTimeFormat("en-EG", {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    });
    return formatter.format(new Date(dateString));
  };
  const filteredData = data?.data?.content?.filter((bus: Bus) =>
    bus.busNumber?.toLowerCase().includes(search.trim().toLowerCase())
  );


  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="mb-6 -mt-2 -ml-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {currentLanguage === "en"
              ? "Bus"
              : currentLanguage === "ar"
                ? "حافلة"
                : currentLanguage === "fr"
                  ? "Autobus"
                  : "Bus"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="bg-bgPrimary rounded-xl">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-4 rounded-lg">
            {/* Search Input */}
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="relative w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  className="w-full border-borderSecondary rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate.searchPlaceholder}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>

            {/* Add New Bus Button */}
            <Link
              href="/add-new-bus"
              className="whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[16px] font-semibold text-white hover:bg-hover hover:shadow-md transition"
            >
              {currentLanguage === "ar"
                ? "+ إضافة حافلة جديدة"
                : currentLanguage === "fr"
                  ? "+ Ajouter un nouveau bus"
                  : "+ Add New Bus"}
            </Link>
          </div>

          <div className="relative overflow-auto shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.busNumber}</TableHead>
                  <TableHead>{translate.capacity}</TableHead>
                  <TableHead>{translate.schoolId}</TableHead>
                  <TableHead>{translate.createdAt}</TableHead>
                  <TableHead>{translate.updatedAt}</TableHead>
                  <TableHead>{translate.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filteredData || filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((bus: Bus, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{bus.busNumber}</TableCell>
                      <TableCell>{bus.busCapacity}</TableCell>
                      <TableCell>{bus.schoolId}</TableCell>
                      <TableCell>{formatTransactionDate(bus.createdAt)}</TableCell>
                      <TableCell>{formatTransactionDate(bus.updatedAt)}</TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/edit-bus/${bus.busId}`}
                          className="text-primary hover:text-primaryHover transition"
                          title={translate.edit}
                        >
                          <BiEditAlt size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(bus.busId)}
                          className="text-error hover:text-red-800 transition"
                          title={translate.delete}
                        >
                          <BiTrash size={20} />
                        </button>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      </Container>
    </>
  );
};

export default Bus;
