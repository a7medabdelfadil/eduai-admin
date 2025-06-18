/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import {
  useDeleteDisciplinaryRecordMutation,
  useGetAllDisciplinaryRecordsQuery,
} from "@/features/Document-Management/disciplinaryApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import Container from "@/components/Container";
import { Text } from "@/components/Text";
import { BiSearchAlt } from "react-icons/bi";
import SeeMoreButton from "@/components/SeeMoreButton";

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
  const filteredRecords = disciplinaryData?.data?.content?.filter(
    (record: any) => {
      const fullText =
        `${record.name} ${record.role} ${record.mobile} ${record.violationType}`.toLowerCase();
      return fullText.includes(searchTerm);
    },
  );

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredRecords?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <Text font={"bold"} size={"3xl"}>
          {currentLanguage === "ar"
            ? "وثائق رسمية أخرى"
            : currentLanguage === "fr"
              ? "Autres documents officiels"
              : "Other Official Documents"}
        </Text>
        <div className="justify-left my-8 ml-4 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/document-management/other"
            className="hover:text-blue-500 hover:underline"
          >
            {currentLanguage === "ar"
              ? "بطاقات الهوية"
              : currentLanguage === "fr"
                ? "Cartes d'identité"
                : "ID Cards"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/medical"
          >
            {currentLanguage === "ar"
              ? "السجلات الطبية"
              : currentLanguage === "fr"
                ? "Dossiers médicaux"
                : "Medical Records"}
          </Link>
          <Link
            className="text-blue-500 underline"
            href="/document-management/other/disciplinary"
          >
            {currentLanguage === "ar"
              ? "السجلات التأديبية"
              : currentLanguage === "fr"
                ? "Dossiers disciplinaires"
                : "Disciplinary Records"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/other/legal"
          >
            {currentLanguage === "ar"
              ? "الوثائق القانونية"
              : currentLanguage === "fr"
                ? "Documents légaux"
                : "Legal Documents"}
          </Link>
        </div>

        <div className="flex items-center justify-between rounded-t-xl bg-bgPrimary text-center max-[502px]:grid max-[502px]:justify-center">
          <div className="flex justify-between p-4 text-center max-[502px]:grid max-[502px]:justify-center">
            <div className="mb-3">
              <label htmlFor="icon" className="sr-only">
                Search
              </label>
              <div className="relative min-w-72 md:min-w-80">
                <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                  <BiSearchAlt className="text-secondary" size={18} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value.toLowerCase())}
                    type="text"
                    id="icon"
                    name="icon"
                    className="border-borderSecondary block w-full rounded-lg border-2 bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none disabled:pointer-events-none disabled:opacity-50 dark:border-borderPrimary"
                    placeholder={
                      currentLanguage === "ar"
                        ? "ابحث عن أي شيء"
                        : currentLanguage === "fr"
                          ? "Rechercher n'importe quoi"
                          : "Search anything"
                    }
                  />
                  <span className="min-w-[120px] text-primary">
                    {filteredRecords?.length} Result(s)
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link
              href="/document-management/other/disciplinary/add-disciplinary"
              className="mx-3 mb-5 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة إشعار تأديبي"
                : currentLanguage === "fr"
                  ? "+ Ajouter un avertissement disciplinaire"
                  : " + Add Disciplinary Notice"}
            </Link>
          </div>
        </div>
        <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="text-textPrimary">
                <TableHead>
                  {currentLanguage === "ar"
                    ? "الاسم"
                    : currentLanguage === "fr"
                      ? "Nom"
                      : "Name"}
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "الجنس"
                    : currentLanguage === "fr"
                      ? "Sexe"
                      : "Gender"}
                </TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "الدور"
                    : currentLanguage === "fr"
                      ? "Rôle"
                      : "Role"}
                </TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "رقم الهاتف"
                    : currentLanguage === "fr"
                      ? "Téléphone"
                      : "Mobile"}
                </TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "المخالفة"
                    : currentLanguage === "fr"
                      ? "Infraction"
                      : "Violation"}
                </TableHead>
                <TableHead>
                  {currentLanguage === "ar"
                    ? "إجراء"
                    : currentLanguage === "fr"
                      ? "Action"
                      : "Action Taken"}
                </TableHead>
                <TableHead className="flex items-center justify-center">
                  {" "}
                  {currentLanguage === "ar"
                    ? "حذف"
                    : currentLanguage === "fr"
                      ? "Supprimer"
                      : "Delete"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isDisciplinaryLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-14" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError || !filteredRecords.length ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-4 text-center text-gray-500"
                  >
                    {currentLanguage === "ar"
                      ? "لا توجد سجلات"
                      : currentLanguage === "fr"
                        ? "Aucun dossier"
                        : "No records found"}
                  </TableCell>
                </TableRow>
              ) : (
                visibleData.map((record: any, index: number) => (
                  <TableRow key={index} data-index={index}>
                    <TableCell className="flex items-center gap-2">
                      <img
                        src={record.picture || "/images/userr.png"}
                        className="h-[24px] w-[24px] rounded-full"
                        alt="profile"
                      />
                      {record.name}
                    </TableCell>
                    <TableCell>{record.id}</TableCell>
                    <TableCell>
                      {record.gender === "MALE"
                        ? currentLanguage === "ar"
                          ? "ذكر"
                          : currentLanguage === "fr"
                            ? "Homme"
                            : "Male"
                        : currentLanguage === "ar"
                          ? "أنثى"
                          : currentLanguage === "fr"
                            ? "Femme"
                            : "Female"}
                    </TableCell>
                    <TableCell>{record.role}</TableCell>
                    <TableCell>{record.mobile}</TableCell>
                    <TableCell>
                      {record.violationType.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      {record.actionTaken.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="flex items-center justify-center">
                      <Dialog
                        open={openDialogId === record.recordId}
                        onOpenChange={open => !open && setOpenDialogId(null)}
                      >
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
                                  await deleteDisciplinaryRecord(
                                    record.recordId,
                                  ).unwrap();
                                  toast.success(
                                    currentLanguage === "ar"
                                      ? "تم حذف السجل بنجاح"
                                      : currentLanguage === "fr"
                                        ? "Enregistrement supprimé avec succès"
                                        : "Record deleted successfully",
                                  );
                                  setOpenDialogId(null);
                                  refetch();
                                } catch (error) {
                                  toast.error(
                                    currentLanguage === "ar"
                                      ? "فشل في حذف السجل"
                                      : currentLanguage === "fr"
                                        ? "Échec de la suppression"
                                        : "Failed to delete record",
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
          {visibleCount < (filteredRecords?.length || 0) && (
            <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
          )}
        </div>
      </Container>
    </>
  );
};

export default Disciplinary;
