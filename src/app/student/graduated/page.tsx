"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import {
  useDeleteStudentsMutation,
  useGetAllStudentsQuery,
} from "@/features/User-Management/studentApi";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { Text } from "@/components/Text";
import { BiSearchAlt } from "react-icons/bi";
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

const GraduateStudent = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "User Management",
      nameAr: "إدارة المستخدمين",
      nameFr: "Gestion des utilisateurs",
      href: "/user-management",
    },
    {
      nameEn: "Student",
      nameAr: "طالب",
      nameFr: "Étudiant",
      href: "/student/graduated",
    },
  ];

  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language
  );
  const t = (en: string, ar: string, fr: string) =>
    currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const { data, error, isLoading, refetch } = useGetAllStudentsQuery({
    archived: "false",
    page: 0,
    size: 1000000,
    graduated: "true",
  });

  const [deleteStudents] = useDeleteStudentsMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteStudents({ id, lock: "true" }).unwrap();
      toast.success(`Student with ID ${id} Locked successfully`);
      void refetch();
    } catch {
      toast.error("Failed to lock the Student");
    }
  };

  const filteredData = data?.data.content?.filter((student: any) =>
    search.trim() === ""
      ? true
      : student.name?.toLowerCase().includes(search.toLowerCase())
  );

  const displayedData = filteredData?.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <Text font="bold" size="3xl">
          {t("All Students", "جميع الطلاب", "Tous les étudiants")}
        </Text>

        <div className="flex items-center gap-4 mb-5 mt-3">
          <Link className="hover:text-blue-500 hover:underline" href="/student">{t("Active Student", "طالب نشط", "Étudiant actif")}</Link>
          <Link className="text-blue-500 underline" href="/student/graduated">
            {t("Graduate Student", "طالب خريج", "Étudiant diplômé")}
          </Link>
        </div>
        <div className="bg-bgPrimary rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-4 rounded-lg">
            <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  className="w-full border-borderPrimary bg-bgPrimary rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={t("Search anything", "ابحث عن أي شيء", "Rechercher n'importe quoi")}
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0} {t("Result(s)", "نتيجة", "résultat(s)")}
                </span>
              </div>
            </div>

            <Link
              href="/add-new-student"
              className="mx-3 w-[190px] whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {t("+ New Student", "+ طالب جديد", "+ Nouvel Élève")}
            </Link>
          </div>
          <div className="relative overflow-auto shadow-md sm:rounded-lg bg-bgPrimary">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Name", "الاسم", "Nom")}</TableHead>
                  <TableHead>{t("ID", "الرقم التعريفي", "ID")}</TableHead>
                  <TableHead>{t("Gender", "الجنس", "Genre")}</TableHead>
                  <TableHead>{t("Nationality", "الجنسية", "Nationalité")}</TableHead>
                  <TableHead>{t("Email", "البريد الإلكتروني", "E-mail")}</TableHead>
                  <TableHead>{t("Mobile", "الهاتف المحمول", "Mobile")}</TableHead>
                  <TableHead>{t("View", "عرض", "Voir")}</TableHead>
                  <TableHead>{t("Action", "الإجراء", "Action")}</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {Array(8)
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
                    <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                      {t("No data available", "لا توجد بيانات", "Aucune donnée")}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedData.map((student: any) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={student.picture ?? "/images/userr.png"}
                            className="h-10 w-10 rounded-full"
                            alt="#"
                          />
                          <p>{student.name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.nationality}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.number}</TableCell>
                      <TableCell>
                        <Link
                          href={`/student/view-student/${student.id}`}
                          className="text-primary hover:underline text-sm"
                        >
                          {t("View", "عرض", "Voir")}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="rounded bg-error px-2 py-1 text-white text-sm hover:scale-105"
                        >
                          {t("Lock", "قفل", "Verrouiller")}
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
        </div>
      </Container>
    </>
  );
};

export default GraduateStudent;
