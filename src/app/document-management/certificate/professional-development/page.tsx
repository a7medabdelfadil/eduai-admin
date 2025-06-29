/* eslint-disable @next/next/no-img-element */
"use client";
import Spinner from "@/components/spinner";
import {
  useGetAllProfessionalsQuery,
  useDeleteProfessionalsMutation,
} from "@/features/Document-Management/professionalApi";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";
import { toast } from "react-toastify";
import BreadCrumbs from "@/components/BreadCrumbs";
import Container from "@/components/Container";
import { BiSearchAlt, BiTrash } from "react-icons/bi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Skeleton } from "@/components/Skeleton";
import { MdDelete } from "react-icons/md";
import SeeMoreButton from "@/components/SeeMoreButton";

const ProfessionalDevelopment = () => {
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
      nameEn: "Professional Development",
      nameAr: "التطوير المهني",
      nameFr: "Développement professionnel",
      href: "/document-management/certificate/professional-development",
    },
  ];

  type Professional = Record<string, any>;
  const [search, setSearch] = useState("");
  const { data, isLoading, refetch } = useGetAllProfessionalsQuery(null);
  const [deleteProfessional] = useDeleteProfessionalsMutation();

  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  const translate = {
    searchPlaceholder:
      currentLanguage === "ar"
        ? "ابحث عن اسم المستخدم"
        : currentLanguage === "fr"
          ? "Rechercher un utilisateur"
          : "Search user",
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
    userName:
      currentLanguage === "ar"
        ? "اسم المستخدم"
        : currentLanguage === "fr"
          ? "Nom d'utilisateur"
          : "User Name",
    type:
      currentLanguage === "ar"
        ? "النوع"
        : currentLanguage === "fr"
          ? "Type"
          : "Type",
    userId:
      currentLanguage === "ar"
        ? "رقم المستخدم"
        : currentLanguage === "fr"
          ? "ID utilisateur"
          : "User Id",
    issueDate:
      currentLanguage === "ar"
        ? "تاريخ الإصدار"
        : currentLanguage === "fr"
          ? "Date d'émission"
          : "Issue Date",
    action:
      currentLanguage === "ar"
        ? "إجراء"
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

  const filteredData = data?.data?.content?.filter(
    (professional: Professional) =>
      search.trim() === ""
        ? true
        : professional.userName
            ?.toLowerCase()
            ?.includes(search.trim().toLowerCase()),
  );

  const [visibleCount, setVisibleCount] = useState(20);
  const visibleData = filteredData?.slice(0, visibleCount);

  const handleDelete = async (id: string) => {
    try {
      await deleteProfessional(id).unwrap();
      toast.success(`Professional with ID ${id} Deleted successfully`);
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };

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
            className="hover:text-blue-500 hover:underline"
          >
            {currentLanguage === "ar"
              ? "إكمال"
              : currentLanguage === "fr"
                ? "Achèvement"
                : "Completion"}
          </Link>
          <Link
            href="/document-management/certificate/achievement"
            className="hover:text-blue-500 hover:underline"
          >
            {currentLanguage === "ar"
              ? "إنجاز"
              : currentLanguage === "fr"
                ? "Réussite"
                : "Achievement"}
          </Link>
          <Link
            href="/document-management/certificate/participation"
            className="hover:text-blue-500 hover:underline"
          >
            {currentLanguage === "ar"
              ? "مشاركة"
              : currentLanguage === "fr"
                ? "Participation"
                : "Participation"}
          </Link>
          <Link
            href="/document-management/certificate/professional-development"
            className="text-blue-500 underline"
          >
            {currentLanguage === "ar"
              ? "تطوير مهني"
              : currentLanguage === "fr"
                ? "Développement Professionnel"
                : "Professional Development"}
          </Link>
        </div>
        <div className="mb-6 rounded-xl bg-bgPrimary">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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

            <Link
              href="/document-management/certificate/add-new-professional"
              className="mx-3 whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white duration-300 ease-in hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "ar"
                ? "+ أضف مهنيين للإنجاز"
                : currentLanguage === "fr"
                  ? "+ Ajouter des Professionnels de la Réussite"
                  : "+ Add Completion Professionals"}
            </Link>
          </div>

          <div className="relative overflow-auto bg-bgPrimary shadow-md sm:rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{translate.userName}</TableHead>
                  <TableHead>{translate.type}</TableHead>
                  <TableHead>{translate.userId}</TableHead>
                  <TableHead>{translate.issueDate}</TableHead>
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
                ) : !filteredData || filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center font-medium">
                      {translate.noData}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map(
                    (professional: Professional, index: number) => (
                      <TableRow key={professional.id} data-index={index}>
                        <TableCell>{professional.userName}</TableCell>
                        <TableCell>{professional.type}</TableCell>
                        <TableCell>{professional.userId}</TableCell>
                        <TableCell>{professional.issueDate}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Link
                            href={`/document-management/certificate/professional-development/${professional.id}`}
                            className="font-medium text-blue-600 hover:underline"
                            title="View"
                          >
                            <img src="/images/print.png" alt="#" />
                          </Link>
                          <BiTrash
                            className="cursor-pointer text-2xl text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(professional.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ),
                  )
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

export default ProfessionalDevelopment;
