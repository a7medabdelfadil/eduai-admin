"use client";
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
import SeeMoreButton from "@/components/SeeMoreButton";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { BiSearchAlt, BiEditAlt, BiTrash } from "react-icons/bi";
import { useState } from "react";
import {
  useDeleteFeesItemMutation,
  useGetFeesItemsByTypeQuery,
} from "@/features/Financial/paymentApi";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/Dialog";
import { toast } from "react-toastify";

const Material = () => {
  const breadcrumbs = [
    { nameEn: "Administration", nameAr: "الإدارة", nameFr: "Administration", href: "/" },
    { nameEn: "Financial Management", nameAr: "الإدارة المالية", nameFr: "Gestion financière", href: "/financial-management" },
    { nameEn: "Material", nameAr: "المواد", nameFr: "Matériel", href: "/financial-management/material" },
  ];

  const { language: currentLanguage } = useSelector((state: RootState) => state.language);
  const { data, isLoading, refetch } = useGetFeesItemsByTypeQuery("MATERIAL");
  const [deleteFeesItem] = useDeleteFeesItemMutation();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  const translate = (en: string, ar: string, fr: string) => {
    return currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;
  };

  const flatData = data?.data || [];

  const filteredData = flatData.filter((item: any) =>
    item.studyLevel?.toLowerCase().includes(search.trim().toLowerCase())
  );
  const visibleData = filteredData.slice(0, visibleCount);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteFeesItem(selectedId).unwrap();
      toast.success(translate("Deleted successfully", "تم الحذف بنجاح", "Supprimé avec succès"));
      refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    } finally {
      setSelectedId(null);
    }
  };

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {translate("Payment", "الدفع", "Paiement")}
          </h1>
        </div>
        <div className="justify-left mb-5 ml-4 flex gap-5 text-[20px] font-semibold">
          <Link className="text-secondary hover:text-blue-500 hover:underline" href="/financial-management/tuition">
            {translate("Tuition", "الرسوم الدراسية", "Frais de scolarité")}
          </Link>
          <Link className="text-secondary hover:text-blue-500 hover:underline" href="/financial-management/activity">
            {translate("Activity", "النشاط", "Activité")}
          </Link>
          <Link className="text-secondary hover:text-blue-500 hover:underline" href="/financial-management/transport">
            {translate("Transport", "النقل", "Transport")}
          </Link>
          <Link className="text-secondary hover:text-blue-500 hover:underline" href="/financial-management/uniform">
            {translate("Uniform", "الزي الرسمي", "Uniforme")}
          </Link>
          <Link className="text-blue-500 underline" href="/financial-management/material">
            {translate("Material", "المواد", "Matériel")}
          </Link>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-4">
            <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate("Search", "بحث", "Recherche")}
                />
                <span className="whitespace-nowrap text-sm text-primary">
                  {filteredData.length} {translate("Result(s)", "النتائج", "Résultat(s)")}
                </span>
              </div>
            </div>

            <Link
              href="/financial-management/material/add-material"
              className="mx-3 w-fit self-end whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white transition-all duration-300 hover:bg-hover hover:shadow-xl"
            >
              {translate("Add Material", "إضافة مادة", "Ajouter du matériel")}
            </Link>
          </div>

          <div className="relative overflow-auto shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate("Level", "الصف", "Niveau")}</TableHead>
                  <TableHead>{translate("Cost", "التكلفة", "Coût")}</TableHead>
                  <TableHead>{translate("About", "عن", "À propos")}</TableHead>
                  <TableHead>{translate("Actions", "الإجراءات", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center font-medium">
                      {translate("No data available", "لا توجد بيانات", "Aucune donnée disponible")}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((item: any, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{item.studyLevel}</TableCell>
                      <TableCell>{item.cost}</TableCell>
                      <TableCell>{item.about || "-"}</TableCell>
                      <TableCell className="flex items-center gap-4">
                        <Link href={`/financial-management/material/edit-material/${item.feesItemId}`}
                          className="text-primary hover:text-blue-600">
                          <BiEditAlt size={20} />
                        </Link>
                        <Dialog open={selectedId === item.feesItemId} onOpenChange={(open) => !open && setSelectedId(null)}>
                          <DialogTrigger asChild>
                            <button
                              onClick={() => setSelectedId(item.feesItemId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <BiTrash size={20} />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{translate("Confirm Delete", "تأكيد الحذف", "Confirmer la suppression")}</DialogTitle>
                            </DialogHeader>
                            <p className="py-2 text-base">
                              {translate(
                                "Are you sure you want to delete this item?",
                                "هل أنت متأكد أنك تريد حذف هذا البند؟",
                                "Êtes-vous sûr de vouloir supprimer cet élément ?"
                              )}
                            </p>
                            <DialogFooter>
                              <button
                                onClick={() => setSelectedId(null)}
                                className="rounded-md border border-borderPrimary bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                              >
                                {translate("Cancel", "إلغاء", "Annuler")}
                              </button>
                              <button
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                              >
                                {translate("Delete", "حذف", "Supprimer")}
                              </button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {visibleCount < filteredData.length && (
              <SeeMoreButton onClick={() => setVisibleCount((prev) => prev + 20)} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Material;
