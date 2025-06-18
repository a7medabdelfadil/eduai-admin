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
import Spinner from "@/components/spinner";
import Link from "next/link";
import { BiSearchAlt, BiTrash, BiEditAlt } from "react-icons/bi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import {
  useGetAllRoomsQuery,
  useDeleteRoomMutation,
} from "@/features/Infrastructure/roomApi";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/Dialog";

const Library = () => {
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
    {
      nameEn: "Library",
      nameAr: "المكتبة",
      nameFr: "bibliothèque",
      href: "/infrastructure/library",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language
  );

  const translate = {
    roomNumber: currentLanguage === "ar" ? "رقم القاعة" : currentLanguage === "fr" ? "Numéro de salle" : "Room Number",
    buildingNumber: currentLanguage === "ar" ? "رقم المبنى" : currentLanguage === "fr" ? "Bâtiment" : "Building",
    floorNumber: currentLanguage === "ar" ? "الطابق" : currentLanguage === "fr" ? "Étage" : "Floor",
    maxCapacity: currentLanguage === "ar" ? "السعة" : currentLanguage === "fr" ? "Capacité" : "Capacity",
    category: currentLanguage === "ar" ? "الفئة" : currentLanguage === "fr" ? "Catégorie" : "Category",
    status: currentLanguage === "ar" ? "الحالة" : currentLanguage === "fr" ? "Statut" : "Status",
    action: currentLanguage === "ar" ? "الإجراء" : currentLanguage === "fr" ? "Action" : "Action",
    searchPlaceholder: currentLanguage === "ar" ? "بحث عن قاعة" : currentLanguage === "fr" ? "Rechercher une salle" : "Search Room",
    noData: currentLanguage === "ar" ? "لا توجد بيانات" : currentLanguage === "fr" ? "Aucune donnée disponible" : "No data available",
    result: currentLanguage === "ar" ? "نتيجة" : currentLanguage === "fr" ? "résultat(s)" : "Result(s)",
    edit: currentLanguage === "ar" ? "تعديل" : currentLanguage === "fr" ? "Modifier" : "Edit",
    delete: currentLanguage === "ar" ? "حذف" : currentLanguage === "fr" ? "Supprimer" : "Delete",
  };

  const { data, isLoading, refetch } = useGetAllRoomsQuery(undefined);
  const [deleteRoom] = useDeleteRoomMutation();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);

  const filteredData = data?.data?.filter((room: any) =>
    room.roomNumber?.toLowerCase().includes(search.trim().toLowerCase())
  );
  const visibleData = filteredData?.slice(0, visibleCount);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Library Room"
              : currentLanguage === "ar"
                ? "غرفة المكتبة"
                : currentLanguage === "fr"
                  ? "Salle de bibliothèque"
                  : "Library Room"}

            {/* default */}
          </h1>
        </div>
        <div className="bg-bgPrimary rounded-xl">
          <div className="p-4 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate.searchPlaceholder}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/infrastructure/library/add-library"
              className="whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[16px] font-semibold text-white transition hover:bg-hover hover:shadow-md"
            >
              {currentLanguage === "en"
                ? "Add Library Room"
                : currentLanguage === "ar"
                  ? "إضافة غرفة مكتبة"
                  : currentLanguage === "fr"
                    ? "Ajouter une salle de bibliothèque"
                    : "Add Library Room"}

            </Link>
          </div>
          <div className="relative overflow-auto shadow-md sm:rounded-lg bg-bgPrimary">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.roomNumber}</TableHead>
                  <TableHead>{translate.buildingNumber}</TableHead>
                  <TableHead>{translate.floorNumber}</TableHead>
                  <TableHead>{translate.maxCapacity}</TableHead>
                  <TableHead>{translate.category}</TableHead>
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
                ) : !filteredData || filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((room: any, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{room.roomNumber}</TableCell>
                      <TableCell>{room.buildingNumber}</TableCell>
                      <TableCell>{room.floorNumber}</TableCell>
                      <TableCell>{room.maxCapacity}</TableCell>
                      <TableCell>{room.category}</TableCell>
                      <TableCell>{room.status}</TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/infrastructure/library/edit-library/${room.roomId}`}
                          className="text-primary transition hover:text-hover"
                          title={translate.edit}
                        >
                          <BiEditAlt size={20} />
                        </Link>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-error transition hover:text-red-800" title={translate.delete}>
                              <BiTrash size={20} />
                            </button>
                          </DialogTrigger>
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
                                  ? "هل أنت متأكد أنك تريد حذف هذه القاعة؟"
                                  : currentLanguage === "fr"
                                    ? "Êtes-vous sûr de vouloir supprimer cette salle ?"
                                    : "Are you sure you want to delete this room?"}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <button className="rounded bg-borderPrimary px-4 py-2 font-medium text-white transition hover:bg-borderDark">
                                  {currentLanguage === "ar" ? "إلغاء" : currentLanguage === "fr" ? "Annuler" : "Cancel"}
                                </button>
                              </DialogClose>
                              <button
                                onClick={async () => {
                                  try {
                                    await deleteRoom(room.roomId).unwrap();
                                    toast.success("Room deleted successfully");
                                    refetch();
                                  } catch (err: any) {
                                    toast.error(err?.data?.message || "Failed to delete room");
                                  }
                                }}
                                className="rounded bg-error px-4 py-2 font-medium text-white transition hover:bg-red-700"
                              >
                                {currentLanguage === "ar" ? "حذف" : currentLanguage === "fr" ? "Supprimer" : "Delete"}
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
            {visibleCount < (filteredData?.length || 0) && (
              <SeeMoreButton onClick={() => setVisibleCount((prev) => prev + 20)} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Library;
