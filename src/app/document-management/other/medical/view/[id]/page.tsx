"use client";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { useParams } from "next/navigation";
import {
  useGetMedicalRecordByStudentIdQuery,
  useDeleteMedicalRecordMutation,
} from "@/features/Document-Management/otherOfficialDocumentsApi";
import { Text } from "@/components/Text";
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
import { useState } from "react";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import { AiOutlineEye, AiOutlineDownload } from "react-icons/ai";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";

const MedicalRecordView = () => {
  const params = useParams();
  const studentId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data, isLoading, refetch } = useGetMedicalRecordByStudentIdQuery(studentId);
  const [deleteMedicalRecord] = useDeleteMedicalRecordMutation();
  const [visibleCount, setVisibleCount] = useState(20);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = (data?.data || []).filter((record: any) =>
    record.MedicalTitle.toLowerCase().includes(search.trim().toLowerCase())
  );
  const visibleData = filtered.slice(0, visibleCount);

  const { language: currentLanguage } = useSelector((state: RootState) => state.language);

  const translate = (en: string, ar: string, fr: string) => {
    return currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMedicalRecord(id).unwrap();
      toast.success(translate("Deleted successfully", "تم الحذف بنجاح", "Supprimé avec succès"));
      setConfirmId(null);
      refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const breadcrumbs = [
    { nameEn: "Administration", nameAr: "الإدارة", nameFr: "Administration", href: "/" },
    { nameEn: "Document Management", nameAr: "إدارة المستندات", nameFr: "Gestion des documents", href: "/document-management" },
    { nameEn: "Medical Records", nameAr: "السجلات الطبية", nameFr: "Dossiers médicaux", href: "/document-management/other/medical" },
    { nameEn: "Medical Record View", nameAr: "عرض السجل الطبي", nameFr: "Voir le dossier médical", href: `/document-management/other/medical/view/${studentId}` },
  ];

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {translate("Medical Records", "السجلات الطبية", "Dossiers médicaux")}

          </h1>
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
                  placeholder={
                    currentLanguage === "en"
                      ? "Search"
                      : currentLanguage === "ar"
                        ? "بحث"
                        : "Recherche"
                  }
                />
                <span className="whitespace-nowrap text-sm text-primary">
                  {filtered?.length ?? 0} {translate("Results", "النتائج", "Résultat(s)")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2 rounded-xl bg-bgPrimary">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{translate("Title", "العنوان", "Titre")}</TableHead>
                    <TableHead>{translate("Result", "النتيجة", "Résultat")}</TableHead>
                    <TableHead>{translate("Note", "ملاحظات", "Remarques")}</TableHead>
                    <TableHead>{translate("File Type", "نوع الملف", "Type de fichier")}</TableHead>
                    <TableHead>{translate("Actions", "إجراءات", "Actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-24" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : visibleData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center font-medium">
                        {translate("No data available", "لا توجد بيانات", "Aucune donnée disponible")}
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleData.map((record: any, index: number) => (
                      <TableRow key={index} data-index={index}>
                        <TableCell>{record.MedicalTitle}</TableCell>
                        <TableCell>
                          {record.MedicalResult ? (
                            <span className="text-success font-bold">✔️</span>
                          ) : (
                            <span className="text-error font-bold">❌</span>
                          )}
                        </TableCell>
                        <TableCell>{record.note || "-"}</TableCell>
                        <TableCell>{record.contentType}</TableCell>
                        <TableCell className="flex items-center gap-3">
                          <a href={record.viewLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800" title={translate("View", "عرض", "Voir")}>
                            <AiOutlineEye size={20} />
                          </a>
                          <a href={record.downloadLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-hover" title={translate("Download", "تحميل", "Télécharger")}>
                            <AiOutlineDownload size={20} />
                          </a>
                          <button onClick={() => setConfirmId(record.MedicalRecordId)} className="text-error hover:text-red-700" title={translate("Delete", "حذف", "Supprimer")}>
                            <BiTrash size={20} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {visibleCount < (filtered.length || 0) && (
                <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
              )}
            </div>
          </div>
        </div>
      </Container>

      <Dialog open={!!confirmId} onOpenChange={(open) => !open && setConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate("Are you sure you want to delete this record?", "هل أنت متأكد أنك تريد حذف هذا السجل؟", "Êtes-vous sûr de vouloir supprimer cet enregistrement ?")}</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <button onClick={() => setConfirmId(null)} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
              {translate("Cancel", "إلغاء", "Annuler")}
            </button>
            <button onClick={() => confirmId && handleDelete(confirmId)} className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
              {translate("Delete", "حذف", "Supprimer")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MedicalRecordView;
