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
  BiEditAlt,
  BiSearchAlt,
  BiTrash,
  BiPlus,
  BiMinus,
} from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import {
  useGetAllResourcesQuery,
  useDeleteResourceMutation,
  useAddItemsToResourceMutation,
  usePullItemsFromResourceMutation,
} from "@/features/Infrastructure/storeApi";
import { useState } from "react";
import { toast } from "react-toastify";
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
    archive: false,
  });
  const [deleteResource] = useDeleteResourceMutation();
  const [addItems] = useAddItemsToResourceMutation();
  const [pullItems] = usePullItemsFromResourceMutation();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [quantityDialogOpen, setQuantityDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [controlMode, setControlMode] = useState<"add" | "pull" | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);

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
            href="/infrastructure/store/digital-resource">
            {currentLanguage === "ar"
              ? "الموارد الرقمية"
              : currentLanguage === "fr"
                ? "Ressources numériques"
                : "Digital Resources"}
            {/* Default to English */}
          </Link>
          <Link
            className="underline-offset-4 hover:text-primary hover:underline"
            href="/infrastructure/store/equipment"
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
            href="/infrastructure/store/facilities"
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
            href="/infrastructure/store/instructional-materials"
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
            href="/infrastructure/store/textbooks"
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
            <Link
              href="/infrastructure/store/facilities/add-facilities"
              className="whitespace-nowrap w-fit self-end rounded-xl bg-primary px-4 py-2 text-[16px] font-semibold text-white transition hover:bg-hover hover:shadow-md"
            >

              {currentLanguage === "en"
                ? "Add Facilities Resource"
                : currentLanguage === "ar"
                  ? "إضافة مورد مرافق"
                  : currentLanguage === "fr"
                    ? "Ajouter une ressource d'installations"
                    : "Add Facilities Resource"}
            </Link>
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
                  <TableHead>{translate.control}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filtered || filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center font-medium">
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
                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/infrastructure/store/facilities/edit-facilities/${item.id}`}
                          className="text-primary transition hover:text-hover"
                          title={translate.edit}
                        >
                          <BiEditAlt size={20} />
                        </Link>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <button
                              className="text-error transition hover:text-red-800"
                              title={translate.delete}
                              onClick={() => setSelectedId(item.id)}
                            >
                              <BiTrash size={20} />
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                {translate.confirmDelete}
                              </DialogTitle>
                              <DialogDescription>
                                {translate.confirmDeleteMsg}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild>
                                <button className="hover:bg-borderDark rounded bg-borderPrimary px-4 py-2 font-medium text-white transition">
                                  {translate.cancel}
                                </button>
                              </DialogClose>
                              <button
                                onClick={async () => {
                                  try {
                                    await deleteResource(selectedId).unwrap();
                                    toast.success(
                                      "Resource deleted successfully",
                                    );
                                    setDialogOpen(false);
                                    refetch();
                                  } catch (err: any) {
                                    toast.error(
                                      err?.data?.message ||
                                      "Failed to delete resource",
                                    );
                                  }
                                }}
                                className="rounded bg-error px-4 py-2 font-medium text-white transition hover:bg-red-700"
                              >
                                {translate.delete}
                              </button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">

                          <button
                            onClick={() => {
                              setControlMode("add");
                              setTargetId(item.id);
                              setQuantityDialogOpen(true);
                            }}
                            className={`rounded bg-success px-2 py-1 text-white hover:bg-green-700`}
                            title="Add"
                          >
                            <BiPlus size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setControlMode("pull");
                              setTargetId(item.id);
                              setQuantityDialogOpen(true);
                            }}
                            className={`rounded bg-yellow-500 px-2 py-1 text-white hover:bg-yellow-600`}
                            title="Pull"
                          >
                            <BiMinus size={18} />
                          </button>
                        </div>

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

      {/* Quantity Dialog */}
      <Dialog open={quantityDialogOpen} onOpenChange={setQuantityDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {controlMode === "add"
                ? currentLanguage === "ar"
                  ? "إضافة كمية"
                  : "Add Quantity"
                : currentLanguage === "ar"
                  ? "سحب كمية"
                  : "Pull Quantity"}
            </DialogTitle>
            <DialogDescription>
              {currentLanguage === "ar"
                ? "أدخل العدد المطلوب"
                : currentLanguage === "fr"
                  ? "Entrez le nombre souhaité"
                  : "Enter the desired number"}
            </DialogDescription>
          </DialogHeader>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={e => setQuantity(Number(e.target.value))}
            className="mt-4 w-full rounded-lg border border-borderPrimary bg-bgPrimary px-3 py-2 outline-none"
          />
          <DialogFooter>
            <DialogClose asChild>
              <button className="hover:bg-borderDark rounded bg-borderPrimary px-4 py-2 font-medium text-white transition">
                {translate.cancel}
              </button>
            </DialogClose>
            <button
              className="rounded bg-primary px-4 py-2 font-medium text-white hover:bg-hover"
              onClick={async () => {
                try {
                  if (controlMode === "add")
                    await addItems({
                      id: targetId!,
                      number: quantity,
                    }).unwrap();
                  if (controlMode === "pull")
                    await pullItems({
                      id: targetId!,
                      number: quantity,
                    }).unwrap();
                  toast.success("Updated successfully");
                  refetch();
                  setQuantityDialogOpen(false);
                  setQuantity(1);
                } catch (err: any) {
                  toast.error(err?.data?.message || "Operation failed");
                }
              }}
            >
              {controlMode === "add"
                ? currentLanguage === "ar"
                  ? "تأكيد الإضافة"
                  : "Confirm Add"
                : currentLanguage === "ar"
                  ? "تأكيد السحب"
                  : "Confirm Pull"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Store;
