"use client";
/* eslint-disable @next/next/no-img-element */
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import { BiEditAlt, BiSearchAlt, BiTrash } from "react-icons/bi";
import SeeMoreButton from "@/components/SeeMoreButton";

const Bus = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Infrastructure",
      nameAr: "الدورات والموارد",
      nameFr: "Cours et Ressources",
      href: "/infrastructure",
    },
    { nameEn: "Bus", nameAr: "الأتوبيس", nameFr: "Autobus", href: "/infrastructure/bus" },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const { data, error, isLoading, refetch } = useGetAllBussQuery("1");
  const [search, setSearch] = useState("");
  const [deleteBuses] = useDeleteBussMutation();
  type Bus = Record<string, any>;

  const t = (label: string) => {
    const translations: Record<string, Record<string, string>> = {
      "Bus Number": { ar: "رقم الحافلة", fr: "Numéro de bus" },
      "Bus Capacity": { ar: "سعة الحافلة", fr: "Capacité du bus" },
      "School Id": { ar: "معرف المدرسة", fr: "ID de l'école" },
      "Created At": { ar: "تاريخ الإنشاء", fr: "Créé le" },
      "Updated At": { ar: "تاريخ التعديل", fr: "Mis à jour le" },
      Action: { ar: "الإجراء", fr: "Action" },
      Edit: { ar: "تعديل", fr: "Modifier" },
      Delete: { ar: "حذف", fr: "Supprimer" },
    };
    return translations[label]?.[currentLanguage] || label;
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBuses(id).unwrap();
      toast.success(`Bus with ID ${id} Deleted successfully`);
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
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

  const filtered = data?.data.content?.filter((bus: Bus) =>
    search === ""
      ? true
      : bus.busNumber?.toString().toLowerCase().includes(search.toLowerCase()),
  );

  const [visibleCount, setVisibleCount] = useState(20);
  const visible = filtered?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Bus"
              : currentLanguage === "ar"
                ? "الأتوبيس"
                : currentLanguage === "fr"
                  ? "Autobus"
                  : "Bus"}{" "}
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
                  {filtered?.length ?? 0} {t("Results")}
                </span>
              </div>
            </div>

            <Link
              href="/infrastructure/bus/add-new-bus"
              className="mx-3 w-fit self-end whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white transition-all duration-300 hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة حافلة جديدة"
                : currentLanguage === "fr"
                  ? "+ Ajouter un nouveau bus"
                  : "+ Add New Bus"}
            </Link>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Bus Number")}</TableHead>
                  <TableHead>{t("Bus Capacity")}</TableHead>
                  <TableHead>{t("School Id")}</TableHead>
                  <TableHead>{t("Created At")}</TableHead>
                  <TableHead>{t("Updated At")}</TableHead>
                  <TableHead>{t("Action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading || isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filtered?.length ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center font-medium">
                      {currentLanguage === "ar"
                        ? "لا توجد بيانات"
                        : currentLanguage === "fr"
                          ? "Aucune donnée disponible"
                          : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((bus: Bus, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{bus.busNumber}</TableCell>
                      <TableCell>{bus.busCapacity}</TableCell>
                      <TableCell>{bus.schoolId}</TableCell>
                      <TableCell>
                        {formatTransactionDate(bus.createdAt)}
                      </TableCell>
                      <TableCell>
                        {formatTransactionDate(bus.updatedAt)}
                      </TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/infrastructure/bus/edit-bus/${bus.busId}`}
                          className="text-primary transition hover:text-hover"
                          title={t("Edit")}
                        >
                          <BiEditAlt size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(bus.busId)}
                          className="text-error transition hover:text-red-800"
                          title={t("Delete")}
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
          {visibleCount < (filtered?.length || 0) && (
            <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
          )}
        </div>
      </Container>
    </>
  );
};

export default Bus;
