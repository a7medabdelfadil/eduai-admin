/* eslint-disable @next/next/no-img-element */
"use client";
import { RootState } from "@/GlobalRedux/store";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import BreadCrumbs from "@/components/BreadCrumbs";
import { toast } from "react-toastify";
import Spinner from "@/components/spinner";
import {
  useDeleteScholarshipMutation,
  useGetAllScholarshipQuery,
} from "@/features/Financial/feesApi";
import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/Table";
import { BiEditAlt, BiSearchAlt, BiTrash } from "react-icons/bi";
import { Skeleton } from "@/components/Skeleton";
import SeeMoreButton from "@/components/SeeMoreButton";

const Scholarship = () => {
  const breadcrumbs = [
    {
      nameEn: "Administration",
      nameAr: "الإدارة",
      nameFr: "Administration",
      href: "/",
    },
    {
      nameEn: "Financial Management",
      nameAr: "الإدارة المالية",
      nameFr: "Gestion financière",
      href: "/financial-management",
    },
    {
      nameEn: "Scholarship",
      nameAr: "منحة دراسية",
      nameFr: "Bourse d'étude",
      href: "/financial-management/fees-management/scholarship",
    },
  ];
  const { data, error, isLoading, refetch } = useGetAllScholarshipQuery(null);
  const [search, setSearch] = useState("");
  const [deleteInvoice] = useDeleteScholarshipMutation();
  const handleDelete = async (id: number) => {
    try {
      await deleteInvoice(id).unwrap();

      toast.success(`Scholarship with ID ${id} Deleted successfully`);
      void refetch();
    } catch (err) {
      toast.error((err as { data: { message: string } }).data?.message);
    }
  };
  const [visibleCount, setVisibleCount] = useState(20);

  const filteredData = data?.data.content?.filter((invoice: Invoice) =>
    invoice.studentName.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
  );
  const visibleData = filteredData?.slice(0, visibleCount);

  type Invoice = Record<string, any>;
  const { language: currentLanguage, loading } = useSelector(
    (state: RootState) => state.language,
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
        <div className="-ml-1 -mt-2 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold">
            {currentLanguage === "en"
              ? "Scholarship"
              : currentLanguage === "ar"
                ? "منحة دراسية"
                : "Bourse d'étude"}
          </h1>
        </div>
        <div className="max-w-screen overflow-x-hidden rounded-xl bg-bgPrimary">

          <div className="flex flex-col md:items-center justify-between gap-4 rounded-lg px-4 py-4 md:flex-row">
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
                  } />
                <span className="min-w-[120px] text-primary">
                  {/* {filteredData?.length ?? 0} {translate.result} */}
                </span>
              </div>
            </div>

            <Link
              href="/financial-management/fees-management/new-scholarship"
              className="mx-3 self-end whitespace-nowrap rounded-xl bg-primary px-4 py-2 text-[18px] font-semibold text-white hover:bg-hover hover:shadow-xl"
            >
              {currentLanguage === "en"
                ? "+ Add Scholarship"
                : currentLanguage === "ar"
                  ? "+ إضافة منحة"
                  : "+ Ajouter une bourse"}
            </Link>
          </div>
          <div className="relative overflow-auto shadow-md sm:rounded-lg bg-bgPrimary">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "student Name"
                      : currentLanguage === "ar"
                        ? "اسم الطالب"
                        : "Nom de l'étudiant"}
                  </TableHead>
                  <TableHead>{currentLanguage === "en" ? "ID" : currentLanguage === "ar" ? "الرقم" : "ID"}</TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "scholarship Name"
                      : currentLanguage === "ar"
                        ? "اسم المنحة الدراسية"
                        : "Nom de la bourse"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "scholarship Type"
                      : currentLanguage === "ar"
                        ? "نوع المنحة الدراسة"
                        : "Type de bourse"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "start Date"
                      : currentLanguage === "ar"
                        ? "تاريخ البدء"
                        : "date de début"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "expiration Date"
                      : currentLanguage === "ar"
                        ? "تاريخ الانتهاء"
                        : "Date d'expiration"}
                  </TableHead>
                  <TableHead>
                    {currentLanguage === "en"
                      ? "Action"
                      : currentLanguage === "ar"
                        ? "الإجراء"
                        : "Action"}
                  </TableHead>
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
                    <TableCell colSpan={7} className="text-center py-6 font-medium">
                      {currentLanguage === "ar"
                        ? "لا توجد بيانات"
                        : currentLanguage === "fr"
                          ? "Aucune donnée disponible"
                          : "No data available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((invoice: Invoice, index: number) => (
                    <TableRow key={index} data-index={index}>
                      <TableCell>
                        <div className="flex items-center">
                          <img
                            src={invoice.photoLink}
                            className="mx-2 h-6 w-6 rounded-full"
                            alt="#"
                          />
                          {invoice.studentName}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell>{invoice.scholarshipName}</TableCell>
                      <TableCell>{invoice.scholarshipType}</TableCell>
                      <TableCell>{invoice.startDate}</TableCell>
                      <TableCell>{invoice.expirationDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDelete(invoice.id)}>
                            <BiTrash className="h-5 w-5 text-red-500" />
                          </button>
                          <Link
                            href={`/financial-management/fees-management/scholarship/${invoice.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            <BiEditAlt className="h-5 w-5" />
                          </Link>
                        </div>
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
            {visibleCount < (filteredData?.length || 0) && (
              <SeeMoreButton onClick={() => setVisibleCount(prev => prev + 20)} />
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Scholarship;
