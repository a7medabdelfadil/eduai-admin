/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useGetAllTeachersQuery,
  useDeleteTeachersMutation,
} from "@/features/User-Management/teacherApi";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import SeeMoreButton from "@/components/SeeMoreButton";

const Teacher = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Archive",
      nameAr: "الأرشيف",
      nameFr: "Archives",
      href: "/archive",
    },
    {
      nameEn: "Teacher",
      nameAr: "المعلم",
      nameFr: "Enseignant",
      href: "/archive/teacher",
    },
  ];

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );
  const translate = {
    name:
      currentLanguage === "ar"
        ? "الاسم"
        : currentLanguage === "fr"
          ? "Nom"
          : "Name",
    gender:
      currentLanguage === "ar"
        ? "الجنس"
        : currentLanguage === "fr"
          ? "Genre"
          : "Gender",
    nationality:
      currentLanguage === "ar"
        ? "الجنسية"
        : currentLanguage === "fr"
          ? "Nationalité"
          : "Nationality",
    email:
      currentLanguage === "ar"
        ? "البريد الإلكتروني"
        : currentLanguage === "fr"
          ? "Courriel"
          : "Email",
    mobile:
      currentLanguage === "ar"
        ? "الجوال"
        : currentLanguage === "fr"
          ? "Mobile"
          : "Mobile",
    view:
      currentLanguage === "ar"
        ? "عرض"
        : currentLanguage === "fr"
          ? "Voir"
          : "View",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    unlock:
      currentLanguage === "ar"
        ? "إلغاء الحظر"
        : currentLanguage === "fr"
          ? "Débloquer"
          : "Unblock",
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
          ? "Aucune donnée disponible"
          : "No data available",
  };

  type Teacher = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllTeachersQuery({
    archived: "true",
    page: 0,
    size: 1000000,
  });
  const [deleteTeachers] = useDeleteTeachersMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteTeachers({ id: id, lock: "false" }).unwrap();
      toast.success(`Teacher with ID ${id} unLocked successfully`);
      void refetch();
    } catch {
      toast.error("Failed to unlock the Teacher");
    }
  };

  const filteredData = data?.data?.content?.filter((teacher: Teacher) =>
    teacher.name?.toLowerCase().includes(search.trim().toLowerCase()),
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
              ? "All Teachers"
              : currentLanguage === "ar"
                ? "جميع المعلمين"
                : currentLanguage === "fr"
                  ? "Tous les enseignants"
                  : "All Teachers"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="rounded-xl bg-bgPrimary max-w-screen overflow-x-hidden">

          <div className="flex flex-col md:items-center md:justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
                  {filteredData?.length ?? 0} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/add-new-teacher"
              className="mx-3 mb-5 w-[200px] whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة معلم جديد"
                : currentLanguage === "fr"
                  ? "+ Ajouter un nouvel enseignant"
                  : "+ Add new Teacher"}
            </Link>
          </div>
          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>{translate.gender}</TableHead>
                  <TableHead>{translate.nationality}</TableHead>
                  <TableHead>{translate.email}</TableHead>
                  <TableHead>{translate.mobile}</TableHead>
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
                ) : !filteredData?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((teacher: Teacher, index: number) => (
                    <TableRow key={teacher.id} data-index={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={teacher.picture || "/images/userr.png"}
                            className="h-6 w-6 rounded-full border object-cover"
                            alt={teacher.name || "teacher"}
                          />
                          <span>{teacher.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{teacher.id}</TableCell>
                      <TableCell>{teacher.gender}</TableCell>
                      <TableCell>{teacher.nationality}</TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/teacher/view-teacher/${teacher.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {translate.view}
                          </Link>
                          <button
                            onClick={() => handleDelete(teacher.id)}
                            className="text-error transition hover:text-red-800"
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

export default Teacher;
