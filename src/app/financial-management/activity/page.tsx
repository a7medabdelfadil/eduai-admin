/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner";
import { useDeleteActivityMutation, useGetAllActivitiesQuery } from "@/features/Financial/activityApi";
import { Skeleton } from "@/components/Skeleton";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/Table";
import { BiSearchAlt } from "react-icons/bi";
import { IoIosAdd } from "react-icons/io";

const Activity = () => {
  const breadcrumbs = [
    { nameEn: "Administration", nameAr: "الإدارة", nameFr: "Administration", href: "/" },
    { nameEn: "Financial Management", nameAr: "الإدارة المالية", nameFr: "Gestion financière", href: "/financial-management" },
    { nameEn: "Activity", nameAr: "النشاط", nameFr: "Activité", href: "/financial-management/activity" },
  ];

  const [dialogToClose, setDialogToClose] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const { language: currentLanguage, loading } = useSelector((state: RootState) => state.language);

  const { data: activitiesData, isLoading: activitiesLoading, refetch } = useGetAllActivitiesQuery(null);
  const [deleteActivity, { isLoading: isDeleting }] = useDeleteActivityMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteActivity(id).unwrap();
      setDialogToClose(id);
      toast.success("Activity deleted successfully!");
      await refetch();
    } catch {
      toast.error("Error deleting activity");
    }
  };

  useEffect(() => {
    refetch();
  }, [refetch]);
  const filteredData = activitiesData?.data?.filter((activity: any) =>
    activity.activityType?.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading) return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className={`${currentLanguage === "ar" ? (booleanValue ? "lg:mr-[100px]" : "lg:mr-[270px]") : (booleanValue ? "lg:ml-[100px]" : "lg:ml-[270px]")} relative mx-3 mt-10 overflow-x-auto bg-bgPrimary sm:rounded-lg`}>
        <div className="p-4 flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  className="border-borderSecondary block w-full rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-borderPrimary"
                  placeholder={currentLanguage === "ar" ? "ابحث عن أي شيء" : currentLanguage === "fr" ? "Rechercher n'importe quoi" : "Search anything"}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length} {currentLanguage === "ar" ? "نتيجة" : currentLanguage === "fr" ? "résultat(s)" : "Result(s)"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link href="/financial-management/activity/add-activity" className="mx-3 mb-5 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold flex items-center text-white duration-300 ease-in hover:bg-hover hover:shadow-xl">
                <IoIosAdd size={30} className="mx-" />
              {currentLanguage === "ar" ? "إضافة نشاط" : currentLanguage === "fr" ? "Ajouter une activité" : "Add Activity"}
            </Link>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="text-textPrimary">
              <TableHead>Activity Type</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>About</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activitiesLoading ? [...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                <TableCell><Skeleton className="h-4 w-14" /></TableCell>
              </TableRow>
            )) : !filteredData?.length ? (
              <TableRow>
                <TableCell className="text-center" colSpan={4}>{currentLanguage === "ar" ? "لا توجد بيانات" : currentLanguage === "fr" ? "Aucune donnée disponible" : "No data available"}</TableCell>
              </TableRow>
            ) : (
              filteredData.map((activity: any, index: number) => (
                <TableRow key={index} data-index={index}>
                  <TableCell>{activity.activityType}</TableCell>
                  <TableCell>{activity.cost}</TableCell>
                  <TableCell>{activity.about || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Link href={`/financial-management/activity/edit-activity/${activity.id}`} className="text-primary hover:text-primaryHover">
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <Dialog open={dialogToClose === activity.id} onOpenChange={(open) => {
                        if (!open) setDialogToClose(null);
                      }}>
                        <DialogTrigger asChild>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => setDialogToClose(activity.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{currentLanguage === "ar" ? "تأكيد الحذف" : currentLanguage === "fr" ? "Confirmer la suppression" : "Confirm Delete"}</DialogTitle>
                          </DialogHeader>
                          <p className="py-2 text-sm">{currentLanguage === "ar" ? "هل أنت متأكد أنك تريد حذف هذا النشاط؟" : currentLanguage === "fr" ? "Êtes-vous sûr de vouloir supprimer cette activité ?" : "Are you sure you want to delete this activity?"}</p>
                          <DialogFooter>
                            <DialogClose asChild>
                              <button className="rounded-md bg-muted px-4 py-2 text-sm">
                                {currentLanguage === "ar" ? "إلغاء" : currentLanguage === "fr" ? "Annuler" : "Cancel"}
                              </button>
                            </DialogClose>
                            <button
                              onClick={async () => {
                                await handleDelete(activity.id);
                                setDialogToClose(null); // 👈 اقفله هنا
                              }}
                              className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                            >
                              {isDeleting
                                ? currentLanguage === "ar"
                                  ? "جارٍ الحذف..."
                                  : currentLanguage === "fr"
                                    ? "Suppression..."
                                    : "Deleting..."
                                : currentLanguage === "ar"
                                  ? "حذف"
                                  : currentLanguage === "fr"
                                    ? "Supprimer"
                                    : "Delete"}
                            </button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Activity;
