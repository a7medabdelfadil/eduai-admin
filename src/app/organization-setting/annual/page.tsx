"use client";
import Link from "next/link";
import { useState } from "react"; // Import useState and useEffect hooks
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Container from "@/components/Container";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import {
  useDeleteAnnualLeaveMutation,
  useGetAllAnnualLeavesQuery,
} from "@/features/Organization-Setteings/annualApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";
import { FiEdit2 } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";

const Annual = () => {
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
      nameEn: "Annual Leave",
      nameAr: "إجازة سنوية",
      nameFr: "Congé annuel",
      href: "/organization-setting/annual",
    },
  ];

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteAnnualLeave, { isLoading: isDeleting }] =
    useDeleteAnnualLeaveMutation();

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const handleDelete = (id: string) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteAnnualLeave(selectedId).unwrap();
      setDeleteDialogOpen(false);
      setSelectedId(null);
      await refetch();
      toast.success(
        currentLanguage === "ar"
          ? "تم حذف الإجازة بنجاح"
          : currentLanguage === "fr"
            ? "Le congé a été supprimé avec succès"
            : "Annual leave deleted successfully",
      );
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const { data, error, isLoading, refetch } = useGetAllAnnualLeavesQuery({});
  const filteredData = data?.data.content.filter((item: any) =>
    search.trim() === ""
      ? true
      : item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const displayedData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "ar"
              ? "إجازة سنوية"
              : currentLanguage === "fr"
                ? "Congé annuel"
                : "Annual Leave"}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col md:items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
                    currentLanguage === "ar"
                      ? "ابحث عن شكوى"
                      : currentLanguage === "fr"
                        ? "Rechercher une plainte"
                        : "Search complaint"
                  }
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
            <Link
              href="/organization-setting/annual/add-new-annual"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "إضافة إجازة سنوية جديدة"
                : currentLanguage === "fr"
                  ? "Ajouter un nouveau congé annuel"
                  : "Add New Annual Leave"}
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "الإجازة"
                    : currentLanguage === "fr"
                      ? "Congé"
                      : "Leave Title"}
                </TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "الوصف"
                    : currentLanguage === "fr"
                      ? "Description"
                      : "Description"}
                </TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "تاريخ البداية"
                    : currentLanguage === "fr"
                      ? "Début"
                      : "Start Date"}
                </TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "تاريخ النهاية"
                    : currentLanguage === "fr"
                      ? "Fin"
                      : "End Date"}
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
                    {Array(5)
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
                    colSpan={5}
                    className="py-6 text-center text-gray-500"
                  >
                    {currentLanguage === "ar"
                      ? "لا توجد بيانات"
                      : currentLanguage === "fr"
                        ? "Aucune donnée"
                        : "No data available"}
                  </TableCell>
                </TableRow>
              ) : (
                displayedData?.map((item: any, index: number) => (
                  <TableRow key={item.annualLeaveId} data-index={index}>
                    <TableCell className="font-medium text-textSecondary">
                      {item.title}
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.startDate}</TableCell>
                    <TableCell>{item.endDate}</TableCell>
                    <TableCell className="flex items-center gap-4">
                      <Link
                        href={`/organization-setting/annual/edit-annual/${item.annualLeaveId}`}
                      >
                        <FiEdit2
                          className="text-blue-600 transition hover:scale-110"
                          size={18}
                        />
                      </Link>
                      <button onClick={() => handleDelete(item.annualLeaveId)}>
                        <BiTrash
                          className="text-error transition hover:scale-110"
                          size={20}
                        />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredData?.length > visibleCount && (
            <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 10)} />
          )}
        </div>
      </Container>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentLanguage === "ar"
                ? "تأكيد الحذف"
                : currentLanguage === "fr"
                  ? "Confirmer la suppression"
                  : "Confirm Deletion"}
            </DialogTitle>
            <DialogDescription>
              {currentLanguage === "ar"
                ? "هل أنت متأكد أنك تريد حذف هذه الإجازة؟"
                : currentLanguage === "fr"
                  ? "Êtes-vous sûr de vouloir supprimer ce congé ?"
                  : "Are you sure you want to delete this leave?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-md border px-4 py-2 text-sm"
            >
              {currentLanguage === "ar"
                ? "إلغاء"
                : currentLanguage === "fr"
                  ? "Annuler"
                  : "Cancel"}
            </button>
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="rounded-md bg-error px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              {isDeleting
                ? currentLanguage === "ar"
                  ? "جاري الحذف..."
                  : currentLanguage === "fr"
                    ? "Suppression..."
                    : "Deleting..."
                : currentLanguage === "ar"
                  ? "تأكيد الحذف"
                  : currentLanguage === "fr"
                    ? "Confirmer"
                    : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Annual;
