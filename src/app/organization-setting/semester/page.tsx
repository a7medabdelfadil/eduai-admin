/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useDeleteSemestersMutation,
  useGetAllSemestersQuery,
} from "@/features/Organization-Setteings/semesterApi";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "@/GlobalRedux/store";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";
import { BiSearchAlt, BiShow, BiTrash } from "react-icons/bi";

const Semester = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Organization Settings",
      nameAr: "إعدادات المنظمة",
      nameFr: "Paramètres org",
      href: "/organization-setting",
    },
    {
      nameEn: "Semester",
      nameAr: "الفصل الدراسي",
      nameFr: "semestre",
      href: "/organization-setting/semester",
    },
  ];
  type Semester = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllSemestersQuery(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const [deleteSemester, { isLoading: isDeleting }] =
    useDeleteSemestersMutation();

  const handleDelete = async (id: any) => {
    try {
      await deleteSemester(id).unwrap();
      toast.success(`Semester with ID ${id} deleted successfully`);
      refetch();
    } catch (err) {
                  toast.error((err as { data: { message: string } }).data?.message);
                }
  };

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
    id:
      currentLanguage === "ar"
        ? "معرف"
        : currentLanguage === "fr"
          ? "ID"
          : "ID",
    startDate:
      currentLanguage === "ar"
        ? "تاريخ البدء"
        : currentLanguage === "fr"
          ? "Date de début"
          : "Start Date",
    endDate:
      currentLanguage === "ar"
        ? "تاريخ الانتهاء"
        : currentLanguage === "fr"
          ? "Date de fin"
          : "End Date",
    view:
      currentLanguage === "ar"
        ? "عرض"
        : currentLanguage === "fr"
          ? "Voir"
          : "View",
    del:
      currentLanguage === "ar"
        ? "حذف"
        : currentLanguage === "fr"
          ? "Supprimer"
          : "Delete",
    action:
      currentLanguage === "ar"
        ? "الإجراء"
        : currentLanguage === "fr"
          ? "Action"
          : "Action",
    noData:
      currentLanguage === "ar"
        ? "لا توجد بيانات"
        : currentLanguage === "fr"
          ? "Aucune donnée disponible"
          : "No data available",
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن قسم"
        : currentLanguage === "fr"
          ? "Rechercher un département"
          : "Search department",
    result:
      currentLanguage === "ar"
        ? "نتيجة"
        : currentLanguage === "fr"
          ? "résultat(s)"
          : "Result(s)",
  };

  const filteredData =
    data?.data?.content?.filter((semester: Semester) =>
      search.trim() === ""
        ? true
        : semester.name.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const visibleData = filteredData.slice(0, visibleCount);

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Semester"
              : currentLanguage === "ar"
                ? "الفصل الدراسي"
                : currentLanguage === "fr"
                  ? "semestre"
                  : "Semester"}{" "}
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
                  {filteredData.length} {translate.result}
                </span>
              </div>
            </div>

            <Link
              href="/organization-setting/semester/add-semester"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ أضف فصل"
                : currentLanguage === "fr"
                  ? "+ Ajouter Semestre"
                  : "+ Add Semester"}
            </Link>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.name}</TableHead>
                  <TableHead>{translate.id}</TableHead>
                  <TableHead>{translate.startDate}</TableHead>
                  <TableHead>{translate.endDate}</TableHead>
                  <TableHead>{translate.action}</TableHead>
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
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((semester: Semester, index: number) => (
                    <TableRow key={semester.id} data-index={index}>
                      <TableCell className="flex items-center gap-2">
                        <div className="w-[50px]">
                          <img
                            src={semester.picture ?? "/images/userr.png"}
                            className="mx-2 h-6 w-6 rounded-full"
                            alt="#"
                          />
                        </div>
                        <p className="text-textSecondary">{semester.name}</p>
                      </TableCell>
                      <TableCell>{semester.id}</TableCell>
                      <TableCell>{semester.startDate}</TableCell>
                      <TableCell>{semester.endDate}</TableCell>
                      <TableCell className="flex items-center gap-3">
                        <Link
                          href={`/organization-setting/semester/${semester.id}`}
                          className="text-primary transition hover:text-hover"
                          title={translate.view}
                        >
                          <BiShow size={20} />
                        </Link>
                        <button
                          disabled={isDeleting}
                          onClick={() => handleDelete(semester.id)}
                          className="text-error transition hover:text-red-800"
                          title={translate.del}
                        >
                          <BiTrash size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {visibleCount < filteredData.length && (
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

export default Semester;
