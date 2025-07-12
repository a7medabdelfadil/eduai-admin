/* eslint-disable @next/next/no-img-element */
"use client";
import {
  useGetAllCertificatesQuery,
  useDeleteCertificatesMutation,
} from "@/features/Document-Management/certificatesApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
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

const Certificate = () => {
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
      nameEn: "Certificate",
      nameAr: "الشهادة",
      nameFr: "Paramètres org",
      href: "/document-management/certificate",
    },
  ];

  type Certificate = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, error, isLoading, refetch } = useGetAllCertificatesQuery(null);

  const [deleteCeftificates] = useDeleteCertificatesMutation();

  const handleDelete = async (id: string) => {
    try {
      await deleteCeftificates(id).unwrap();
      toast.success(`Certificate with ID ${id} Deleted successfully`);
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

  const filteredData = data?.data?.content?.filter(
    (certificate: Certificate) =>
      search.trim() === ""
        ? true
        : certificate.studentName
          ?.toLowerCase()
          ?.includes(search.trim().toLowerCase()),
  );
  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount);

  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
  );

  return (
    <>
      <BreadCrumbs breadcrumbs={breadcrumbs} />
      <Container>
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Certificates"
              : currentLanguage === "ar"
                ? "الشهادات"
                : currentLanguage === "fr"
                  ? "Paramètres org"
                  : "Certificates"}{" "}
            {/* default */}
          </h1>
        </div>
        <div className="justify-left mb-6 ml-4 flex flex-wrap gap-5 text-[20px] font-semibold max-[725px]:text-[15px]">
          <Link
            href="/document-management/certificate"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "إكمال"
              : currentLanguage === "fr"
                ? "Achèvement"
                : "Completion"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/certificate/achievement"
          >
            {currentLanguage === "ar"
              ? "إنجاز"
              : currentLanguage === "fr"
                ? "Réussite"
                : "Achievement"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/certificate/participation"
          >
            {currentLanguage === "ar"
              ? "مشاركة"
              : currentLanguage === "fr"
                ? "Participation"
                : "Participation"}
          </Link>
          <Link
            className="hover:text-blue-500 hover:underline"
            href="/document-management/certificate/professional-development"
          >
            {currentLanguage === "ar"
              ? "تطوير مهني"
              : currentLanguage === "fr"
                ? "Développement Professionnel"
                : "Professional Development"}
          </Link>
        </div>
        <div className="mb-6 rounded-xl bg-bgPrimary">
          <div className="flex flex-col md:items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
                  placeholder={
                    currentLanguage === "ar"
                      ? "ابحث عن شهادة"
                      : currentLanguage === "fr"
                        ? "Rechercher un certificat"
                        : "Search certificate"
                  }
                />
                <span className="min-w-[120px] text-primary">
                  {filteredData?.length ?? 0}{" "}
                  {currentLanguage === "ar"
                    ? "نتيجة"
                    : currentLanguage === "fr"
                      ? "résultat(s)"
                      : "Result(s)"}
                </span>
              </div>
            </div>

            {/* Add New Bus Button */}
            <Link
              href="/document-management/certificate/add-new-certificate"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ إضافة شهادات إكمال"
                : currentLanguage === "fr"
                  ? "+ Ajouter des Certificats d'Achèvement"
                  : "+ Add Completion Certificates"}
            </Link>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "اسم الطالب"
                      : currentLanguage === "fr"
                        ? "Nom de l'Étudiant"
                        : "Student Name"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "المرحلة"
                      : currentLanguage === "fr"
                        ? "Étape"
                        : "Stage"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "رقم الطالب"
                      : currentLanguage === "fr"
                        ? "ID de l'Étudiant"
                        : "Student Id"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "تاريخ الإصدار"
                      : currentLanguage === "fr"
                        ? "Date d'Émission"
                        : "Issue Date"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "ar"
                      ? "إجراء"
                      : currentLanguage === "fr"
                        ? "Action"
                        : "Action"}
                  </TableHead>
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
                ) : !filteredData || filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center font-medium">
                      {currentLanguage === "ar"
                        ? "لا توجد بيانات"
                        : currentLanguage === "fr"
                          ? "Aucune donnée disponible"
                          : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((certificate: Certificate, index: number) => (
                    <TableRow key={certificate.id} data-index={index}>
                      <TableCell>{certificate.studentName}</TableCell>
                      <TableCell>{certificate.stage}</TableCell>
                      <TableCell>{certificate.studentId}</TableCell>
                      <TableCell>{certificate.issueDate}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Link
                          href={`/document-management/certificate/${certificate.id}`}
                          className="font-medium text-blue-600 hover:underline"
                          title="View"
                        >
                          <img src="/images/print.png" alt="#" />
                        </Link>
                        <BiTrash
                          className="cursor-pointer text-2xl text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(certificate.id)}
                        />
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

export default Certificate;
