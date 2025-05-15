/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useDeleteDisciplinaryRecordMutation, useGetAllDisciplinaryRecordsQuery } from "@/features/Document-Management/disciplinaryApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/Dialog";
import { toast } from "react-toastify";
import { useState } from "react";
import { RiDeleteBin6Fill } from "react-icons/ri";

const Disciplinary = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Document Management",
      nameAr: "إدارة المستندات",
      nameFr: "Gestion des documents",
      href: "/document-management",
    },
    {
      nameEn: "Other Official Documents",
      nameAr: "وثائق رسمية أخرى",
      nameFr: "Autres documents officiels",
      href: "/document-management/other",
    },
    {
      nameEn: "Disciplinary Records",
      nameAr: "السجلات التأديبية",
      nameFr: "Dossiers disciplinaires",
      href: "/document-management/other/disciplinary",
    },
  ];
  const booleanValue = useSelector((state: RootState) => state.boolean.value);
  const [openDialogId, setOpenDialogId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: disciplinaryData,
    isLoading: isDisciplinaryLoading,
    isError,
    refetch,
  } = useGetAllDisciplinaryRecordsQuery(null);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const [deleteDisciplinaryRecord] = useDeleteDisciplinaryRecordMutation();
  const filteredRecords = disciplinaryData?.data?.content?.filter((record: any) => {
    const fullText = `${record.name} ${record.role} ${record.mobile} ${record.violationType}`.toLowerCase();
    return fullText.includes(searchTerm);
  });

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <div
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
        className={`${currentLanguage === "ar"
          ? booleanValue
            ? "lg:mr-[100px]"
            : "lg:mr-[270px]"
          : booleanValue
            ? "lg:ml-[100px]"
            : "lg:ml-[270px]"
          } relative mx-3 mt-10 h-screen overflow-x-auto bg-transparent sm:rounded-lg`}
      >
        <div className="flex justify-between text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="mb-3">
            <label htmlFor="icon" className="sr-only">
              Search
            </label>
            <div className="relative min-w-72 md:min-w-80">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <svg
                  className="size-4 flex-shrink-0 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                id="icon"
                name="icon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="block w-full rounded-lg border-2 border-borderPrimary px-4 py-2 ps-11 text-sm outline-none focus:border-blue-500 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
                placeholder={
                  currentLanguage === "en"
                    ? "Search"
                    : currentLanguage === "ar"
                      ? "بحث"
                      : "Recherche"
                }
              />

            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/document-management/other/disciplinary/add-disciplinary"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-[#4a5cc5] hover:shadow-xl"
            >
              Add Disciplinary Notice
            </Link>
          </div>
        </div>
        <div className="justify-left mb-[80px] ml-4 mt-[50px] flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link href="/document-management/other">
            {currentLanguage === "ar"
              ? "بطاقات الهوية"
              : currentLanguage === "fr"
                ? "Cartes d'identité"
                : "ID Cards"}
          </Link>
          <Link href="/document-management/other/medical">
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            href="/document-management/other/disciplinary"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link href="/document-management/other/financial">
            {currentLanguage === "ar"
              ? "المساعدات المالية"
              : currentLanguage === "fr"
                ? "Aide financière"
                : "Financial Aid"}
          </Link>
          <Link href="/document-management/other/legal">
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>
        <div className="relative overflow-auto shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="text-textPrimary">
                <TableHead>{currentLanguage === "ar" ? "الاسم" : currentLanguage === "fr" ? "Nom" : "Name"}</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الجنس" : currentLanguage === "fr" ? "Sexe" : "Gender"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "الدور" : currentLanguage === "fr" ? "Rôle" : "Role"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "رقم الهاتف" : currentLanguage === "fr" ? "Téléphone" : "Mobile"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "المخالفة" : currentLanguage === "fr" ? "Infraction" : "Violation"}</TableHead>
                <TableHead>{currentLanguage === "ar" ? "إجراء" : currentLanguage === "fr" ? "Action" : "Action Taken"}</TableHead>
                <TableHead className="flex items-center justify-center" >  {currentLanguage === "ar" ? "حذف" : currentLanguage === "fr" ? "Supprimer" : "Delete"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDisciplinaryLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                  </TableRow>
                ))
              ) : isError || !filteredRecords.length ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    {currentLanguage === "ar"
                      ? "لا توجد سجلات"
                      : currentLanguage === "fr"
                        ? "Aucun dossier"
                        : "No records found"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record: any, index: number) => (
                  <TableRow key={index} data-index={index}>
                    <TableCell className="flex items-center gap-2">
                      <img src={record.picture || "/images/userr.png"} className="h-[24px] w-[24px] rounded-full" alt="profile" />
                      {record.name}
                    </TableCell>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                      {record.gender === "MALE"
                        ? currentLanguage === "ar" ? "ذكر" : currentLanguage === "fr" ? "Homme" : "Male"
                        : currentLanguage === "ar" ? "أنثى" : currentLanguage === "fr" ? "Femme" : "Female"}
                    </TableCell>
                    <TableCell>{record.role}</TableCell>
                    <TableCell>{record.mobile}</TableCell>
                    <TableCell>{record.violationType.replace(/_/g, " ")}</TableCell>
                    <TableCell>{record.actionTaken.replace(/_/g, " ")}</TableCell>
                    <TableCell className="flex items-center justify-center">
                      <Dialog open={openDialogId === record.recordId} onOpenChange={(open) => !open && setOpenDialogId(null)}>
                        <DialogTrigger asChild>
                          <button
                            onClick={() => setOpenDialogId(record.recordId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <RiDeleteBin6Fill size={24} />

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
                                ? "هل أنت متأكد أنك تريد حذف هذا السجل؟"
                                : currentLanguage === "fr"
                                  ? "Êtes-vous sûr de vouloir supprimer cet enregistrement ?"
                                  : "Are you sure you want to delete this record?"}
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <DialogClose asChild>
                              <button className="rounded-md bg-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-400">
                                {currentLanguage === "ar"
                                  ? "إلغاء"
                                  : currentLanguage === "fr"
                                    ? "Annuler"
                                    : "Cancel"}
                              </button>
                            </DialogClose>
                            <button
                              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                              onClick={async () => {
                                try {
                                  await deleteDisciplinaryRecord(record.recordId).unwrap();
                                  toast.success(
                                    currentLanguage === "ar"
                                      ? "تم حذف السجل بنجاح"
                                      : currentLanguage === "fr"
                                        ? "Enregistrement supprimé avec succès"
                                        : "Record deleted successfully"
                                  );
                                  setOpenDialogId(null);
                                  refetch();
                                } catch (error) {
                                  toast.error(
                                    currentLanguage === "ar"
                                      ? "فشل في حذف السجل"
                                      : currentLanguage === "fr"
                                        ? "Échec de la suppression"
                                        : "Failed to delete record"
                                  );
                                  setOpenDialogId(null);
                                }
                              }}
                            >
                              {currentLanguage === "ar"
                                ? "حذف"
                                : currentLanguage === "fr"
                                  ? "Supprimer"
                                  : "Delete"}
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

        </div>
      </div>
    </>
  );
};

export default Disciplinary;
