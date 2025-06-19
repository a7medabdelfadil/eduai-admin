"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import {
  useGetAllOfficesQuery,
  useDeleteOfficesMutation,
} from "@/features/Infrastructure/officeApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { RiEdit2Fill } from "react-icons/ri";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";
import { BiSearchAlt, BiTrash } from "react-icons/bi";

const Office = () => {
  const breadcrumbs = [
    {
      nameEn: "Operations",
      nameAr: "العمليات",
      nameFr: "Opérations",
      href: "/",
    },
    {
      nameEn: "Infrastructure",
      nameAr: "البنية التحتية",
      nameFr: "Infrastructure",
      href: "/infrastructure",
    },
    {
      nameEn: "Office",
      nameAr: "المكتب",
      nameFr: "Bureau",
      href: "/infrastructure/office",
    },
  ];

  const { data, isLoading, refetch } = useGetAllOfficesQuery(null);
  const [deleteOffice] = useDeleteOfficesMutation();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const t = (en: string, ar: string, fr: string) =>
    currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;

  const handleDelete = async (id: number) => {
    try {
      await deleteOffice(id).unwrap();
      toast.success(t("Office deleted", "تم حذف المكتب", "Bureau supprimé"));
      void refetch();
    } catch {
      toast.error(
        t("Failed to delete", "فشل الحذف", "Échec de la suppression"),
      );
    }
  };

  const filteredData = data?.data.content?.filter((office: any) =>
    office.labName?.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedData = filteredData?.slice(0, visibleCount);
  const handleShowMore = () => setVisibleCount(prev => prev + 10);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Office"
              : currentLanguage === "ar"
                ? "المكتب"
                : currentLanguage === "fr"
                  ? "Bureau"
                  : "Office"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
            {/* Search Input */}
            <div
              onChange={e => setSearch((e.target as HTMLInputElement).value)}
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
                  placeholder={t("Search", "بحث", "Recherche")}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0}{" "}
                  {currentLanguage === "ar"
                    ? "نتيجة"
                    : currentLanguage === "fr"
                      ? "résultat(s)"
                      : "Result(s)"}
                </span>
              </div>
            </div>

            {/* Add New Bus Button */}
            <Link
              href="/infrastructure/office/add-office"
              className="rounded-xl bg-primary px-4 py-2 font-semibold text-white hover:bg-secondary"
            >
              {t("+ New Office", "+ مكتب جديد", "+ Nouveau bureau")}
            </Link>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("Lab Name", "اسم المختبر", "Nom du laboratoire")}
                  </TableHead>
                  <TableHead>
                    {t("Building Number", "رقم المبنى", "Numéro du bâtiment")}
                  </TableHead>
                  <TableHead>{t("Category", "الفئة", "Catégorie")}</TableHead>
                  <TableHead>
                    {t("Room Number", "رقم الغرفة", "Numéro de la salle")}
                  </TableHead>
                  <TableHead>
                    {t(
                      "Max Capacity",
                      "الطاقة الاستيعابية القصوى",
                      "Capacité maximale",
                    )}
                  </TableHead>
                  <TableHead>
                    {t("Floor Number", "رقم الطابق", "Numéro de l'étage")}
                  </TableHead>
                  <TableHead>{t("Type", "النوع", "Type")}</TableHead>
                  <TableHead>{t("Status", "الحالة", "État")}</TableHead>
                  <TableHead>{t("Action", "الإجراء", "Action")}</TableHead>
                  <TableHead>{t("Edit", "تعديل", "Modifier")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array(10)
                        .fill(0)
                        .map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
                ) : displayedData?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="py-6 text-center text-gray-500"
                    >
                      {t(
                        "No data available",
                        "لا توجد بيانات",
                        "Aucune donnée",
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedData.map((office: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{office.labName}</TableCell>
                      <TableCell>{office.buildingNumber}</TableCell>
                      <TableCell>{office.category}</TableCell>
                      <TableCell>{office.roomNumber}</TableCell>
                      <TableCell>{office.maxCapacity}</TableCell>
                      <TableCell>{office.floorNumber}</TableCell>
                      <TableCell>{office.type}</TableCell>
                      <TableCell>{office.status}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelete(office.roomId)}
                          title={t("Delete", "حذف", "Supprimer")}
                          className="text-red-500 hover:text-red-700"
                        >
                          <BiTrash className="h-5 w-5" />
                        </button>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/infrastructure/office/${office.roomId}`}
                          title={t("Edit", "تعديل", "Modifier")}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <RiEdit2Fill className="h-5 w-5" />
                        </Link>
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
        </div>
      </Container>
    </>
  );
};

export default Office;
