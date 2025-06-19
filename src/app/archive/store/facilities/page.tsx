"use client";
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
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import Link from "next/link";
import {
  BiSearchAlt,
} from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import {
  useGetAllResourcesQuery,
  useRestoreResourceMutation,
} from "@/features/Infrastructure/storeApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

const Store = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Infrastructure",
      nameAr: "البنية التحتية",
      nameFr: "Infrastructure",
      href: "/infrastructure",
    },
    {
      nameEn: "Facilities",
      nameAr: "مرافق",
      nameFr: "Installations",
      href: "/infrastructure/store/facilities",
    },
  ];

  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );
  const { data, isLoading, refetch } = useGetAllResourcesQuery({
    resourceType: "FACILITIES",
    archive: true,
  });
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const translate = {
    name:
      currentLanguage === "ar"
        ? "الاسم"
        : currentLanguage === "fr"
          ? "Nom"
          : "Name",
    totalCount:
      currentLanguage === "ar"
        ? "العدد الإجمالي"
        : currentLanguage === "fr"
          ? "Nombre total"
          : "Total Count",
    lastAdded:
      currentLanguage === "ar"
        ? "آخر إضافة"
        : currentLanguage === "fr"
          ? "Dernière addition"
          : "Last Added",
    lastPulled:
      currentLanguage === "ar"
        ? "آخر سحب"
        : currentLanguage === "fr"
          ? "Dernier retrait"
          : "Last Pulled",
    updatedAt:
      currentLanguage === "ar"
        ? "آخر تحديث"
        : currentLanguage === "fr"
          ? "Dernière mise à jour"
          : "Last Update",
    status:
      currentLanguage === "ar"
        ? "الحالة"
        : currentLanguage === "fr"
          ? "Statut"
          : "Status",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    control:
      currentLanguage === "ar"
        ? "تحكم"
        : currentLanguage === "fr"
          ? "Contrôle"
          : "Control",
    searchPlaceholder:
      currentLanguage === "ar"
        ? "بحث عن مورد"
        : currentLanguage === "fr"
          ? "Rechercher une ressource"
          : "Search resource",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
    edit:
      currentLanguage === "ar"
        ? "تعديل"
        : currentLanguage === "fr"
          ? "Modifier"
          : "Edit",
    delete:
      currentLanguage === "ar"
        ? "حذف"
        : currentLanguage === "fr"
          ? "Supprimer"
          : "Delete",
    result:
      currentLanguage === "ar"
        ? "النتائج"
        : currentLanguage === "fr"
          ? "Résultat(s)"
          : "Result(s)",
    confirmDelete:
      currentLanguage === "ar"
        ? "تأكيد الحذف"
        : currentLanguage === "fr"
          ? "Confirmer la suppression"
          : "Confirm Deletion",
    confirmDeleteMsg:
      currentLanguage === "ar"
        ? "هل أنت متأكد أنك تريد حذف هذا المورد؟"
        : currentLanguage === "fr"
          ? "Êtes-vous sûr de vouloir supprimer cette ressource ?"
          : "Are you sure you want to delete this resource?",
    cancel:
      currentLanguage === "ar"
        ? "إلغاء"
        : currentLanguage === "fr"
          ? "Annuler"
          : "Cancel",
  };

  const filtered = data?.data?.filter((item: any) =>
    item.name?.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const visibleData = filtered?.slice(0, visibleCount);
  const [restoreResource] = useRestoreResourceMutation();

  const handleRestore = async (id: number) => {
    try {
      await restoreResource(id).unwrap();
      toast.success("Resource restored successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to restore resource");
    }
  };
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "ar"
              ? "مرافق"
              : currentLanguage === "fr"
                ? "Installations"
                : "Facilities"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="flex max-w-screen flex-wrap mb-4 items-center gap-7 overflow-auto rounded-t-xl px-3 font-semibold">
          <Link
            className="underline-offset-4 hover:text-primary hover:underline"
            href="/archive/store/digital-resource">
            {currentLanguage === "ar"
              ? "الموارد الرقمية"
              : currentLanguage === "fr"
                ? "Ressources numériques"
                : "Digital Resources"}
            {/* Default to English */}
          </Link>
          <Link
            className="underline-offset-4 hover:text-primary hover:underline"
            href="/archive/store/equipment"
          >
            {currentLanguage === "ar"
              ? "المعدات"
              : currentLanguage === "fr"
                ? "Équipement"
                : "Equipment"}
            {/* Default to English */}
          </Link>
          <Link
            className="text-primary underline underline-offset-4"
            href="/archive/store/facilities"
          >
            {currentLanguage === "ar"
              ? "المرافق"
              : currentLanguage === "fr"
                ? "Installations"
                : "Facilities"}
            {/* Default to English */}
          </Link>
          <Link
            className="underline-offset-4 hover:text-primary hover:underline"
            href="/archive/store/instructional-materials"
          >
            {currentLanguage === "ar"
              ? "المواد التعليمية"
              : currentLanguage === "fr"
                ? "Matériel didactique"
                : "Instructional Materials"}

            {/* Default to English */}
          </Link>
          <Link
            className="underline-offset-4 hover:text-primary hover:underline"
            href="/archive/store/textbooks"
          >
            {currentLanguage === "ar"
              ? "الكتب الدراسية"
              : currentLanguage === "fr"
                ? "Manuels scolaires"
                : "textBooks"}
            {/* Default to English */}
          </Link>
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
                  placeholder={translate.searchPlaceholder}
                />
                <span className="whitespace-nowrap text-sm text-primary">
                  {filtered?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>{translate.totalCount}</TableHead>
                  <TableHead>{translate.lastAdded}</TableHead>
                  <TableHead>{translate.lastPulled}</TableHead>
                  <TableHead>{translate.updatedAt}</TableHead>
                  <TableHead>{translate.status}</TableHead>
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
                ) : !filtered || filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((item: any, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.totalCount}</TableCell>
                      <TableCell>{item.lastAddedNumber}</TableCell>
                      <TableCell>{item.lastPulledNumber}</TableCell>
                      <TableCell>{formatDate(item.updatedDate)}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleRestore(item.id)}
                          className="text-primary hover:text-green-600"
                          title="Restore"
                        >
                          <MdOutlineSettingsBackupRestore size={22} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {visibleCount < (filtered?.length || 0) && (
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

export default Store;
