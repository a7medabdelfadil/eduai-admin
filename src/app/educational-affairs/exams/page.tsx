"use client";
/* eslint-disable @next/next/no-img-element */
import Spinner from "@/components/spinner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  useGetAllExamsQuery,
  useDeleteExamMutation,
} from "@/features/Acadimic/examsApi";
import Container from "@/components/Container";
import { BiSearchAlt } from "react-icons/bi";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import SeeMoreButton from "@/components/SeeMoreButton";

const Exams = () => {
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
      nameEn: "Exams",
      nameAr: "المكتبة",
      nameFr: "Autoexam",
      href: "/educational-affairs/exams",
    },
  ];

  const { data, error, isLoading, refetch } = useGetAllExamsQuery(null);
  const [search, setSearch] = useState("");

  const [deleteExames] = useDeleteExamMutation();
  type Exam = Record<string, any>;

  const handleDelete = async (id: number) => {
    try {
      await deleteExames(id).unwrap();

      toast.success(`Exam with ID ${id} Deleted successfully`);
      void refetch();
    } catch {
      toast.error("Failed to Delete the Exam");
    }
  };

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  const filteredData = data?.filter((exam: Exam) =>
    search.trim() === ""
      ? true
      : exam.teacherName?.toLowerCase()?.includes(search.trim().toLowerCase()),
  );
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount);

  const translate = {
    examDate:
      currentLanguage === "ar"
        ? "تاريخ الامتحان"
        : currentLanguage === "fr"
          ? "Date de l'examen"
          : "Exam Date",
    beginning:
      currentLanguage === "ar"
        ? "البدء"
        : currentLanguage === "fr"
          ? "Début"
          : "Beginning",
    ending:
      currentLanguage === "ar"
        ? "الانتهاء"
        : currentLanguage === "fr"
          ? "Fin"
          : "Ending",
    teacher:
      currentLanguage === "ar"
        ? "المعلم"
        : currentLanguage === "fr"
          ? "Enseignant"
          : "Teacher",
    course:
      currentLanguage === "ar"
        ? "المقرر"
        : currentLanguage === "fr"
          ? "Cours"
          : "Course",
    semester:
      currentLanguage === "ar"
        ? "الفصل"
        : currentLanguage === "fr"
          ? "Semestre"
          : "Semester",
    className:
      currentLanguage === "ar"
        ? "الصف"
        : currentLanguage === "fr"
          ? "Classe"
          : "Class",
    type:
      currentLanguage === "ar"
        ? "النوع"
        : currentLanguage === "fr"
          ? "Type"
          : "Type",
    action:
      currentLanguage === "ar"
        ? "إجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée"
          : "No data available",
    view:
      currentLanguage === "ar"
        ? "عرض"
        : currentLanguage === "fr"
          ? "Voir"
          : "View",
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
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن اسم المعلم"
        : currentLanguage === "fr"
          ? "Rechercher un enseignant"
          : "Search teacher",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };

  if (isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Exams"
              : currentLanguage === "ar"
                ? "المكتبة"
                : currentLanguage === "fr"
                  ? "Autoexam"
                  : "Exams"}{" "}
            {/* default */}
          </h1>
        </div>

        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
            {/* Search Input */}
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

            {/* Add New Bus Button */}
            <Link
              href="/educational-affairs/exams/add-exam"
              className="mx-3 w-fit whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة حافلة جديدة"
                : currentLanguage === "fr"
                  ? "+ Ajouter un nouveau exam"
                  : "+ Add New Exam"}
            </Link>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.examDate}</TableHead>
                  <TableHead>{translate.beginning}</TableHead>
                  <TableHead>{translate.ending}</TableHead>
                  <TableHead>{translate.teacher}</TableHead>
                  <TableHead>{translate.course}</TableHead>
                  <TableHead>{translate.semester}</TableHead>
                  <TableHead>{translate.className}</TableHead>
                  <TableHead>{translate.type}</TableHead>
                  <TableHead>{translate.action}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filteredData || filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((exam: Exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>{exam.examDate}</TableCell>
                      <TableCell>{exam.examBeginning}</TableCell>
                      <TableCell>{exam.examEnding}</TableCell>
                      <TableCell>{exam.teacherName}</TableCell>
                      <TableCell>{exam.courseName}</TableCell>
                      <TableCell>{exam.semesterName}</TableCell>
                      <TableCell>{exam.className}</TableCell>
                      <TableCell>{exam.examTypeName}</TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Link
                          href={`/educational-affairs/exams/exam-result/${exam.id}`}
                          className="text-textSecondary hover:text-textPrimary"
                          title={translate.view}
                        >
                          <MdVisibility size={20} />
                        </Link>
                        <Link
                          href={`/educational-affairs/exams/${exam.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title={translate.edit}
                        >
                          <MdEdit size={20} />
                        </Link>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="text-error hover:text-red-800"
                          title={translate.delete}
                        >
                          <MdDelete size={20} />
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

export default Exams;
