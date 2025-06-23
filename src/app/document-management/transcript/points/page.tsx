"use client";
import Link from "next/link";
import { useState } from "react";
import BreadCrumbs from "@/components/BreadCrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import Spinner from "@/components/spinner";
import { useGetAllListPointsQuery } from "@/features/Document-Management/certificatesApi";
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

const Points = () => {
  const breadcrumbs = [
    { nameEn: "Administration", nameAr: "الإدارة", nameFr: "Administration", href: "/" },
    { nameEn: "Document Management", nameAr: "إدارة المستندات", nameFr: "Gestion des documents", href: "/document-management" },
    { nameEn: "Points", nameAr: "النقاط", nameFr: "Points", href: "/document-management/transcript/points" },
  ];

  const { data, isLoading } = useGetAllListPointsQuery(null);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const { language: currentLanguage, loading } = useSelector((state: RootState) => state.language);

  const translate = (en: string, ar: string, fr: string) => {
    return currentLanguage === "ar" ? ar : currentLanguage === "fr" ? fr : en;
  };

  const filtered = data?.data?.content?.filter((student: any) =>
    student.studentName.toLowerCase().includes(search.trim().toLowerCase())
  ) || [];

  const visibleData = filtered.slice(0, visibleCount);

  if (loading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {translate("Transcripts", "السجلات", "Relevés de notes")}
          </h1>
        </div>

        <div className="flex flex-col md:flex-row flex-wrap gap-4">
          <Link href="/document-management/transcript" className="hover:text-blue-500 hover:underline">
            {translate("Course List", "قائمة الدورات", "Liste des cours")}
          </Link>
          <Link href="/document-management/transcript/points" className="text-blue-500 underline">
            {translate("List Of Points", "قائمة النقاط", "Liste des points")}
          </Link>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary mt-4">
          <div className="flex flex-col gap-4 rounded-lg px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div dir={currentLanguage === "ar" ? "rtl" : "ltr"} className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-20 flex items-center ps-4">
                <BiSearchAlt className="text-secondary" size={18} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  onChange={e => setSearch(e.target.value)}
                  type="text"
                  className="w-full rounded-lg border-2 border-borderPrimary bg-bgPrimary px-4 py-2 ps-11 text-lg outline-none"
                  placeholder={translate("Search", "بحث", "Recherche")}
                />
                <span className="whitespace-nowrap text-sm text-primary">
                  {filtered.length} {translate("Result(s)", "النتائج", "Résultat(s)")}
                </span>
              </div>
            </div>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate("Name", "الاسم", "Nom")}</TableHead>
                  <TableHead>{translate("ID", "الرقم التعريفي", "ID")}</TableHead>
                  <TableHead>{translate("Gender", "الجنس", "Genre")}</TableHead>
                  <TableHead>{translate("Age", "العمر", "Âge")}</TableHead>
                  <TableHead>{translate("Study Level", "مستوى الدراسة", "Niveau d'étude")}</TableHead>
                  <TableHead>{translate("Educational Stage", "المرحلة التعليمية", "Niveau d'éducation")}</TableHead>
                  <TableHead>{translate("View", "عرض", "Voir")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-6 text-center font-medium">
                      {translate("No data available", "لا توجد بيانات متاحة", "Aucune donnée disponible")}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((point: any, i: number) => (
                    <TableRow key={i} data-index={i}>
                      <TableCell className="flex items-center gap-2">
                        <img
                          src={point.photoLink || "/images/userr.png"}
                          className="h-6 w-6 rounded-full"
                          alt="#"
                        />
                        <span className="text-textSecondary">{point.studentName}</span>
                      </TableCell>
                      <TableCell>{point.studentId}</TableCell>
                      <TableCell>{point.gender}</TableCell>
                      <TableCell>{point.age}</TableCell>
                      <TableCell>{point.studyLevel}</TableCell>
                      <TableCell>{point.studyStage}</TableCell>
                      <TableCell>
                        <Link
                          href={`/document-management/transcript/points/${point.studentId}`}
                          className="text-blue-600 hover:underline"
                        >
                          {translate("View", "عرض", "Voir")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {visibleCount < filtered.length && (
              <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Points;
