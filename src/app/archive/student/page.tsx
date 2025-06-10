/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { useState } from "react";
import {
  useGetAllStudentsQuery,
  useDeleteStudentsMutation,
} from "@/features/User-Management/studentApi";
import Spinner from "@/components/spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import { GrView } from "react-icons/gr";

const Student = () => {
  const breadcrumbs = [
    { nameEn: "Administration", nameAr: "الإدارة", nameFr: "Administration", href: "/" },
    { nameEn: "Archive", nameAr: "الأرشيف", nameFr: "Archives", href: "/archive" },
    { nameEn: "Student", nameAr: "طالب", nameFr: "Étudiant", href: "/archive/student" },
  ];

  const { language: currentLanguage, loading } = useSelector((state: RootState) => state.language);
  const translate = {
    name: currentLanguage === "ar" ? "الاسم" : currentLanguage === "fr" ? "Nom" : "Name",
    gender: currentLanguage === "ar" ? "الجنس" : currentLanguage === "fr" ? "Genre" : "Gender",
    nationality: currentLanguage === "ar" ? "الجنسية" : currentLanguage === "fr" ? "Nationalité" : "Nationality",
    email: currentLanguage === "ar" ? "البريد الإلكتروني" : currentLanguage === "fr" ? "Courriel" : "Email",
    mobile: currentLanguage === "ar" ? "الجوال" : currentLanguage === "fr" ? "Mobile" : "Mobile",
    classroom: currentLanguage === "ar" ? "الفصل الدراسي" : currentLanguage === "fr" ? "classe" : "Classroom",
    view: currentLanguage === "ar" ? "عرض" : currentLanguage === "fr" ? "Voir" : "View",
    action: currentLanguage === "ar" ? "الإجراء" : currentLanguage === "fr" ? "Action" : "Action",
    unlock: currentLanguage === "ar" ? "إلغاء الحظر" : currentLanguage === "fr" ? "Débloquer" : "Unblock",
    noData: currentLanguage === "ar" ? "لا توجد بيانات" : currentLanguage === "fr" ? "Aucune donnée disponible" : "No data available",
    result: currentLanguage === "ar" ? "نتيجة" : currentLanguage === "fr" ? "résultat(s)" : "Result(s)",
    birthDate: currentLanguage === "ar" ? "تاريخ الميلاد" : currentLanguage === "fr" ? "Date de naissance" : "Birth Date",
  };

  type Student = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllStudentsQuery({
    archived: "true",
    page: 0,
    size: 1000000,
    graduated: "false",
  });
  const [deleteStudents] = useDeleteStudentsMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteStudents({ id: id, lock: "false" }).unwrap();
      toast.success(`Student with ID ${id} unLocked successfully`);
      void refetch();
    } catch (err) {
      toast.error("Failed to unlock the Student");
    }
  };

  const filteredData = data?.data?.content?.filter((student: Student) =>
    student.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  if (loading || isLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="mb-6 -mt-2 -ml-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {currentLanguage === "en"
              ? "All Students"
              : currentLanguage === "ar"
                ? "جميع الطلاب"
                : currentLanguage === "fr"
                  ? "Tous les élèves"
                  : "All Students"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="bg-bgPrimary rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-4 py-4">
            <div
              dir={currentLanguage === "ar" ? "rtl" : "ltr"}
              className="relative w-full max-w-md"
            >
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  className="w-full border-borderSecondary rounded-lg border-2 px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={
                    currentLanguage === "en"
                      ? "Search"
                      : currentLanguage === "ar"
                        ? "بحث"
                        : "Recherche"
                  }
                />
                <span className="text-sm text-primary whitespace-nowrap">
                  {filteredData?.length ?? 0} {translate.result}
                </span>

              </div>
            </div>

            <Link
              href="/add-new-parent"
              className="mx-3 mb-5 w-[190px] whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar" ? "+ طالب جديد" : currentLanguage === "fr" ? "+ Nouvel étudiant" : "+ New Student"}
            </Link>
          </div>
          <div className="relative overflow-auto shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>{translate.gender}</TableHead>
                  <TableHead>{translate.nationality}</TableHead>
                  <TableHead>{translate.email}</TableHead>
                  <TableHead>{translate.birthDate}</TableHead>
                  <TableHead>{translate.classroom}</TableHead>
                  <TableHead>{translate.action}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : !filteredData?.length ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((student: Student, index: number) => (
                    <TableRow key={student.id} data-index={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={student.picture || "/images/userr.png"}
                            className="h-6 w-6 rounded-full object-cover border"
                            alt={student.name || "student"}
                          />
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.gender}</TableCell>
                      <TableCell>{student.nationality}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.birthDate}</TableCell>
                      <TableCell>{student.classroomName}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Link href={`/student/view-student/${student.id}`} className="text-blue-600 hover:underline">
                            <GrView />
                          </Link>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-error hover:text-red-800 transition"
                            title={translate.unlock}
                          >
                            <BiTrash size={20} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Student;