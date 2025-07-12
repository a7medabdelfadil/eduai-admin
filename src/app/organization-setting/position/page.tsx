/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useDeletePositionsMutation,
  useGetAllPositionsQuery,
} from "@/features/Organization-Setteings/positionApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
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
import { BiSearchAlt, BiShow, BiTrash } from "react-icons/bi";
const Position = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Position",
      nameAr: "المنصب",
      nameFr: "Poste",
      href: "/organization-setting/position",
    },
  ];

  type Position = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllPositionsQuery(null);
  const [visibleCount, setVisibleCount] = useState(20);

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
    id:
      currentLanguage === "ar"
        ? "الرقم التعريفي"
        : currentLanguage === "fr"
          ? "ID"
          : "ID",
    createdAt:
      currentLanguage === "ar"
        ? "تم إنشاؤه في"
        : currentLanguage === "fr"
          ? "Créé à"
          : "Created At",
    updatedAt:
      currentLanguage === "ar"
        ? "تم التحديث في"
        : currentLanguage === "fr"
          ? "Mis à jour à"
          : "Updated At",
    view:
      currentLanguage === "ar"
        ? "عرض"
        : currentLanguage === "fr"
          ? "Afficher"
          : "View",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    del:
      currentLanguage === "ar"
        ? "حذف"
        : currentLanguage === "fr"
          ? "Supprimer"
          : "Delete",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن قسم"
        : currentLanguage === "fr"
          ? "Rechercher un département"
          : "Search department",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };

  const [deletePosition, { isLoading: isDeleting }] =
    useDeletePositionsMutation();

  const handleDelete = async (id: any) => {
    try {
      await deletePosition(id).unwrap();
      toast.success(`Position with ID ${id} deleted successfully`);
      refetch();
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

  const filteredData =
    data?.data?.content?.filter((position: Position) =>
      search.trim() === ""
        ? true
        : position.title.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Position"
              : currentLanguage === "ar"
                ? "المنصب"
                : currentLanguage === "fr"
                  ? "Poste"
                  : "Position"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col md:items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate.searchPlaceholder}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData.length} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/organization-setting/position/add-position"
              className="mx-3 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة وظيفة"
                : currentLanguage === "fr"
                  ? "+ Ajouter un poste"
                  : "+ Add Position"}
            </Link>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>{translate.id}</TableHead>
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
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((position: any, index: number) => (
                    <TableRow key={position.id} data-index={index}>
                      <TableCell className="flex items-center gap-2">
                        <div className="w-[50px]">
                          <img
                            src={position.picture ?? "/images/userr.png"}
                            className="mx-2 h-6 w-6 rounded-full"
                            alt="#"
                          />
                        </div>
                        <p className="text-textSecondary">{position.title}</p>
                      </TableCell>
                      <TableCell>{position.id}</TableCell>
                      <TableCell>
                        {formatTransactionDate(position.createdAt)}
                      </TableCell>
                      <TableCell>
                        {formatTransactionDate(position.updatedAt)}
                      </TableCell>

                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/organization-setting/position/${position.id}`}
                          className="text-primary transition hover:text-hover"
                          title={translate.view}
                        >
                          <BiShow size={20} />
                        </Link>
                        <button
                          disabled={isDeleting}
                          onClick={() => handleDelete(position.id)}
                          className="text-error transition hover:text-red-800"
                          title={translate.del}
                        >
                          <BiTrash size={20} />
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
    </>
  );
};

export default Position;
