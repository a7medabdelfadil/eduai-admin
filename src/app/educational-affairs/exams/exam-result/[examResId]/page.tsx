"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useGetExamResByIdQuery,
  useDeleteExamResultMutation,
} from "@/features/Acadimic/examsApi";
import Container from "@/components/Container";
import { BiSearchAlt } from "react-icons/bi";
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

interface ParamsType {
  params: {
    examResId: number;
  };
}

const ExamRes = ({ params }: ParamsType) => {
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
  const breadcrumbs = [
    {
      nameEn: "Academic",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Educational Affairs",
      nameAr: "الدورات والموارد",
      nameFr: "Cours et Ressources",
      href: "/educational-affairs",
    },
    {
      nameEn: "Exam Result",
      nameAr: "المكتبة",
      nameFr: "Autoexam",
      href: `/educational-affairs/exams/exam-result/${params.examResId}`,
    },
  ];

  const { data, error, isLoading, refetch } = useGetExamResByIdQuery(
    params.examResId,
  );
  const [search, setSearch] = useState("");

  const [deleteExames] = useDeleteExamResultMutation();
  type Exam = Record<string, any>;

  const handleDelete = async (id: number) => {
    try {
      await deleteExames(id).unwrap();

      toast.success(`Exam Result with ID ${id} Deleted successfully`);
      void refetch();
    } catch {
      toast.error("Failed to Delete the Exam Result");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const translate = {
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن الطالب"
        : currentLanguage === "fr"
          ? "Rechercher un étudiant"
          : "Search student",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée"
          : "No data available",
    name:
      currentLanguage === "ar"
        ? "اسم الطالب"
        : currentLanguage === "fr"
          ? "Nom de l'étudiant"
          : "Student Name",
    id:
      currentLanguage === "ar"
        ? "رقم الطالب"
        : currentLanguage === "fr"
          ? "ID de l'étudiant"
          : "Student ID",
    status:
      currentLanguage === "ar"
        ? "الحالة"
        : currentLanguage === "fr"
          ? "Statut"
          : "Status",
    score:
      currentLanguage === "ar"
        ? "الدرجة"
        : currentLanguage === "fr"
          ? "Note"
          : "Score",
    scoreDate:
      currentLanguage === "ar"
        ? "تاريخ الدرجة"
        : currentLanguage === "fr"
          ? "Date de la note"
          : "Score Date",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    delete:
      currentLanguage === "ar"
        ? "حذف"
        : currentLanguage === "fr"
          ? "Supprimer"
          : "Delete",
  };

  const filteredData = data?.filter((exam: Exam) =>
    search.trim() === ""
      ? true
      : exam.studentName?.toLowerCase()?.includes(search.trim().toLowerCase()),
  );
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Exam Result"
              : currentLanguage === "ar"
                ? "المكتبة"
                : currentLanguage === "fr"
                  ? "Autoexam"
                  : "Exam Result"}{" "}
            {/* default */}
          </h1>
        </div>

        <div className="rounded-xl bg-bgPrimary">
          {/* Search Input */}
          <div className="p-4">
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
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>{translate.id}</TableHead>
                  <TableHead>{translate.status}</TableHead>
                  <TableHead>{translate.score}</TableHead>
                  <TableHead>{translate.scoreDate}</TableHead>
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
                ) : !filteredData || filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((exam: Exam, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>{exam.studentName}</TableCell>
                      <TableCell>{exam.studentId}</TableCell>
                      <TableCell>{exam.status}</TableCell>
                      <TableCell>{exam.score}</TableCell>
                      <TableCell>
                        {formatTransactionDate(exam.scoreDate)}
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="font-semibold text-error hover:text-red-800"
                        >
                          {translate.delete}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {visibleCount < (filteredData?.length || 0) && (
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

export default ExamRes;
